package com.tingeso.m3_solicitud_credito.service;

import com.tingeso.m3_solicitud_credito.clients.UserFeignClient;
import com.tingeso.m3_solicitud_credito.dto.CreditRequestWithCreditDTO;
import com.tingeso.m3_solicitud_credito.entity.CreditEntity;
import com.tingeso.m3_solicitud_credito.entity.FinEvalEntity;
import com.tingeso.m3_solicitud_credito.model.User;
import com.tingeso.m3_solicitud_credito.repository.CreditRepository;
import com.tingeso.m3_solicitud_credito.repository.CreditRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class CreditRequestService {

    private final CreditRepository creditRepository;
    CreditRequestRepository creditRequestRepository;
    UserFeignClient userFeignClient;

    @Autowired
    public CreditRequestService(CreditRequestRepository creditRequestRepository,
                                UserFeignClient userFeignClient, CreditRepository creditRepository) {
        this.creditRequestRepository = creditRequestRepository;
        this.userFeignClient = userFeignClient;
        this.creditRepository = creditRepository;
    }


    //P3: Solicitud de Credito
    //Entrada: CreditEntity credito
    //Salida: 'true' si se registro la solicitud (FinEvalEntity) con exito, 'false' en otro caso
    //casos 'false' se generar por cliente solicitante que no esta registrado
    public boolean makeRequest(Long userId, CreditEntity credit)
    {
        User user = userFeignClient.findById(userId);
        if (user!=null)
        {
            FinEvalEntity requestNew = new FinEvalEntity();
            if ( requestNew.getMonthlyCreditFee()!= null
                    && requestNew.getMonthlyClientIncome()!=null && requestNew.getCurrentJobAntiquity()!=null
                    && requestNew.getMonthlyDebt() != null && requestNew.getBankAccountBalance()!=null)
            {
                //solicitud tiene campos requeridos completados
                requestNew.setHasSufficientDocuments(false);
                requestNew.setHasGoodCreditHistory(null);
                requestNew.setIsSelfEmployed(null);
                requestNew.setHasGoodIncomeHistory(null);
                requestNew.setBiggestWithdrawalInLastYear(null);
                requestNew.setTotalDepositsInLastYear(null);
                requestNew.setBankAccountAge(null);
                requestNew.setBiggestWithdrawalInLastSemester(null);
                if (requestNew.getDocumentsIds().isEmpty())
                {
                    //campos requeridos completados pero no ingresa documentos
                    //Se ingresa request en estado 'E2'
                    requestNew.setStatus("E2");

                    creditRequestRepository.save(requestNew);
                    credit.setFinEvalId(requestNew.getFinEvalId());
                    creditRepository.save(credit);
                    return true;
                }
                else
                {
                    //campos requeridos completados e ingresa documentos
                    //Se ingresa request en estado 'E3'
                    requestNew.setStatus("E3");
                    creditRequestRepository.save(requestNew);
                    credit.setFinEvalId(requestNew.getFinEvalId());
                    creditRepository.save(credit);
                    return true;
                }
            }
            else
            {
                //solicitud no tiene todos los campos requeridos completados
                //Se ingresa request en estado 'E1'
                requestNew.setStatus("E1");
                creditRequestRepository.save(requestNew);
                credit.setFinEvalId(requestNew.getFinEvalId());
                creditRepository.save(credit);
                return true;
            }
        }
        else
        {
            return false;
        }
    }

    public FinEvalEntity findById(Long id){return creditRequestRepository.findById(id).orElse(null);}

    public List<FinEvalEntity> findAll(){return creditRequestRepository.findAll();}

    public FinEvalEntity save(FinEvalEntity requestNew){return creditRequestRepository.save(requestNew);}

    public void deleteById(Long finEvalId){creditRequestRepository.deleteById(finEvalId);}

    public List<CreditRequestWithCreditDTO> getAllCreditRequestsWithCredits() {
        // Retrieve all FinEval entities
        List<FinEvalEntity> finEvals = creditRequestRepository.findAll();

        // Map each FinEval to a DTO with its associated Credits
        return finEvals.stream()
                .map(finEval -> {
                    // Find credits associated with this FinEval
                    CreditEntity credits = creditRepository.findByFinEvalId(finEval.getFinEvalId());
                    return new CreditRequestWithCreditDTO(finEval, credits);
                })
                .collect(Collectors.toList());
    }

    public CreditRequestWithCreditDTO getCreditRequestWithCreditDTO(Long id) {
        FinEvalEntity finEval = creditRequestRepository.findById(id).orElse(null);
        if (finEval!= null)
        {
            CreditEntity credit = creditRepository.findByFinEvalId(finEval.getFinEvalId());
            return new CreditRequestWithCreditDTO(finEval, credit);
        }
        else return null;
    }

    public CreditRequestWithCreditDTO saveFinEvalWithCredits(CreditRequestWithCreditDTO finEvalWithCreditDTO) {
        // Save the FinEval entity first
        FinEvalEntity savedFinEval = creditRequestRepository.save(finEvalWithCreditDTO.getFinEval());

        // Set the finEvalId for each Credit and save
        if (finEvalWithCreditDTO.getCredits()!= null) {
            CreditEntity credit = creditRepository.save(finEvalWithCreditDTO.getCredits());
            return new CreditRequestWithCreditDTO(savedFinEval, credit);
        }
        // Return a new DTO with the saved entities
        else{
            CreditEntity credit = new CreditEntity();
            credit.setFinEvalId(finEvalWithCreditDTO.getFinEval().getFinEvalId());
            return new CreditRequestWithCreditDTO(savedFinEval, credit);
        }
    }
}
