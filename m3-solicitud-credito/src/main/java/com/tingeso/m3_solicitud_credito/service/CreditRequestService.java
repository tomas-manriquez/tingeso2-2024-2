package com.tingeso.m3_solicitud_credito.service;

import com.tingeso.m3_solicitud_credito.clients.UserFeignClient;
import com.tingeso.m3_solicitud_credito.entity.FinEvalEntity;
import com.tingeso.m3_solicitud_credito.model.User;
import com.tingeso.m3_solicitud_credito.repository.CreditRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class CreditRequestService {

    CreditRequestRepository creditRequestRepository;
    UserFeignClient userFeignClient;

    @Autowired
    public CreditRequestService(CreditRequestRepository creditRequestRepository,
                        UserFeignClient userFeignClient) {
        this.creditRequestRepository = creditRequestRepository;
        this.userFeignClient = userFeignClient;
    }


    //P3: Solicitud de Credito
    //Entrada: RequestEntity request
    //Salida: 'true' si se registro la solicitud con exito, 'false' en otro caso
    //casos 'false' se generar por cliente solicitante que no esta registrado
    public boolean makeRequest(FinEvalEntity requestNew)
    {
        //User user = restTemplate.getForObject("http://actual-registro-usuario/request/" + requestNew.getUserId(), User.class);
        User user = userFeignClient.findById(requestNew.getUserId());
        if (user!=null)
        {
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
                    return true;
                }
                else
                {
                    //campos requeridos completados e ingresa documentos
                    //Se ingresa request en estado 'E3'
                    requestNew.setStatus("E3");
                    creditRequestRepository.save(requestNew);
                    return true;
                }
            }
            else
            {
                //solicitud no tiene todos los campos requeridos completados
                //Se ingresa request en estado 'E1'
                requestNew.setStatus("E1");
                creditRequestRepository.save(requestNew);
                return true;
            }
        }
        else
        {
            return false;
        }
    }

    public FinEvalEntity findById(Long id){return creditRequestRepository.findById(id).orElse(null);}

    public FinEvalEntity save(FinEvalEntity requestNew){return creditRequestRepository.save(requestNew);}
}
