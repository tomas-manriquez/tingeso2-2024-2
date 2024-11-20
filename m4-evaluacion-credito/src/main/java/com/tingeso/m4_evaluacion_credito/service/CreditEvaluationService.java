package com.tingeso.m4_evaluacion_credito.service;

import com.tingeso.m4_evaluacion_credito.clients.FinEvalFeignClient;
import com.tingeso.m4_evaluacion_credito.clients.SimulationFeignClient;
import com.tingeso.m4_evaluacion_credito.clients.UserFeignClient;
import com.tingeso.m4_evaluacion_credito.model.Credit;
import com.tingeso.m4_evaluacion_credito.model.FinEval;
import com.tingeso.m4_evaluacion_credito.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class CreditEvaluationService {
    UserFeignClient userFeignClient;
    FinEvalFeignClient finEvalFeignClient;
    SimulationFeignClient simulationFeignClient;

    @Autowired
    public CreditEvaluationService(UserFeignClient userFeignClient, FinEvalFeignClient finEvalFeignClient, SimulationFeignClient simulationFeignClient)
    {
        this.userFeignClient = userFeignClient;
        this.finEvalFeignClient = finEvalFeignClient;
        this.simulationFeignClient = simulationFeignClient;
    }

    //P4: Evaluacion de Credito
    //Entrada: RequestEntity request
    //Salida: Request actualizado. Como efecto secundario, se altera el 'status' del RequestEntity de entrada segun reglas de negocio
    public FinEval requestEvaluation(FinEval request, Long creditId)
    {
        if (finEvalFeignClient.findById(request.getFinEvalId()) != null)  //solicitud existe en Base de Datos
        {
            if(request.getStatus().equals("E2") && request.getDocumentsIds().isEmpty())
            {
                //Solicitud en estado Pendiente de Documentacion y aun no tiene documentos, nada que evaluar
                return request;
            }
            if(request.getStatus().equals("E7") || request.getStatus().equals("E8") || request.getStatus().equals("E9") || request.getStatus().equals("E6"))
            {
                //credito aceptado, rechazado, cancelado o en desembolso, nada que evaluar
                return request;
            }
            else
            {
                Credit credit = finEvalFeignClient.findByCreditId(creditId);
                if (credit.getType() != null && credit.getMaxPayTerm() != null
                        && credit.getAnnualInterestRate() != null && credit.getMaxFinanceAmount() != null
                        && credit.getPropertyValue() != null && request.getMonthlyCreditFee() != null
                        && request.getMonthlyClientIncome() != null && request.getHasGoodCreditHistory() != null
                        && request.getCurrentJobAntiquity() != null && request.getIsSelfEmployed() != null
                        && request.getHasGoodIncomeHistory() != null
                        && request.getBankAccountBalance() != null && request.getBiggestWithdrawalInLastYear() != null
                        && request.getTotalDepositsInLastYear() != null && request.getBankAccountAge() != null
                        && request.getBiggestWithdrawalInLastSemester() != null)
                {
                    if(request.getStatus().equals("E1")) //En revision inicial pero se actualizaron los datos
                    {
                        if(request.isHasSufficientDocuments()) //actualizaron datos y tiene documentos, pasa a E3 evaluacion
                        {
                            request.setStatus("E3");
                            finEvalFeignClient.save(request);
                            return request;
                        }
                        else    //actualizaron datos y no tiene documentos suficientes, pasa a E2 pendiente de documentacion
                        {
                            request.setStatus("E2");
                            finEvalFeignClient.save(request);
                            return request;
                        }
                    }
                    //TODO SimulationFeignClient
                    Double totalCostMonthly = simulationFeignClient.simulation(credit);
                    request.setMonthlyDebt(totalCostMonthly);
                    float feeIncomeRate = (request.getMonthlyCreditFee().floatValue() / request.getMonthlyDebt().floatValue());
                    if (feeIncomeRate > 0.35D) //Falla R1, solicitud rechazada
                    {
                        request.setStatus("E7");
                        finEvalFeignClient.save(request);
                        return request;
                    }
                    if (!request.getHasGoodCreditHistory()) //Falla R2, solicitud rechazada
                    {
                        request.setStatus("E7");
                        finEvalFeignClient.save(request);
                        return request;
                    }
                    if(request.getIsSelfEmployed())
                    {
                        if (!request.getHasGoodIncomeHistory()) //R3 no cumple condicion para trabajador independiente, solicitud rechazada
                        {
                            request.setStatus("E7");
                            finEvalFeignClient.save(request);
                        }
                    }
                    else
                    {
                        if (request.getCurrentJobAntiquity() < 12) //R3 no cumple condicion para empleado, solicitud rechazada
                        {
                            request.setStatus("E7");
                            finEvalFeignClient.save(request);
                        }
                    }
                    if( (request.getMonthlyDebt() + request.getMonthlyCreditFee()) > request.getMonthlyClientIncome()*0.5)
                    {
                        //Falla R4, solicitud rechazada
                        request.setStatus("E7");
                        finEvalFeignClient.save(request);
                    }
                    //switch case para R5
                    switch (credit.getType())
                    {
                        case("vivienda1"):                              //condiciones de credito para primera vivienda
                            if(credit.getMaxFinanceAmount() > 0.8f)    //si monto financiamiento excede el maximo, ajustar a ese valor
                            {
                                credit.setMaxFinanceAmount(0.8f);
                            }
                            if(credit.getMaxPayTerm() > 30)            //si plazo excede el maximo, ajustar a ese valor
                            {
                                credit.setMaxPayTerm(30);
                            }
                            if(credit.getAnnualInterestRate() < 3.5f)      //si tasa de interes es menor al minimo, ajustar a ese valor
                            {
                                credit.setAnnualInterestRate(3.5D);
                            }
                            if(credit.getAnnualInterestRate() > 5.0f)      //si tasa de interes es mayor al maximo, ajustar a ese valor
                            {
                                credit.setAnnualInterestRate(5.0D);
                            }

                            finEvalFeignClient.saveCredit(credit);
                            break;
                        case("vivienda2"):                              //condiciones de credito para segunda vivienda
                            if(credit.getMaxFinanceAmount() > 0.7f)    //si monto financiamiento excede el maximo, ajustar a ese valor
                            {
                                credit.setMaxFinanceAmount(0.7f);
                                finEvalFeignClient.saveCredit(credit);
                            }
                            if(credit.getMaxPayTerm() > 20)            //si plazo excede el maximo, ajustar a ese valor
                            {
                                credit.setMaxPayTerm(20);
                            }
                            if(credit.getAnnualInterestRate() < 4.0f)      //si tasa de interes es menor al minimo, ajustar a ese valor
                            {
                                credit.setAnnualInterestRate(4.0D);
                            }
                            if(credit.getAnnualInterestRate() > 6.0f)      //si tasa de interes es mayor al maximo, ajustar a ese valor
                            {
                                credit.setAnnualInterestRate(6.0D);
                            }

                            finEvalFeignClient.saveCredit(credit);
                            break;
                        case("comercial"):                              //condiciones de credito para propiedad comercial
                            if(credit.getMaxFinanceAmount() > 0.6f)    //si monto financiamiento excede el maximo, ajustar a ese valor
                            {
                                credit.setMaxFinanceAmount(0.6f);
                                finEvalFeignClient.saveCredit(credit);
                            }
                            if(credit.getMaxPayTerm() > 25)            //si plazo excede el maximo, ajustar a ese valor
                            {
                                credit.setMaxPayTerm(25);
                            }
                            if(credit.getAnnualInterestRate() < 5.0f)      //si tasa de interes es menor al minimo, ajustar a ese valor
                            {
                                credit.setAnnualInterestRate(5.0D);
                            }
                            if(credit.getAnnualInterestRate() > 7.0f)      //si tasa de interes es mayor al maximo, ajustar a ese valor
                            {
                                credit.setAnnualInterestRate(7.0D);
                            }

                            finEvalFeignClient.saveCredit(credit);
                            break;
                        case("remodelacion"):                           //condiciones de credito para remodelacion
                            if(credit.getMaxFinanceAmount() > 0.5f)    //si monto financiamiento excede el maximo, ajustar a ese valor
                            {
                                credit.setMaxFinanceAmount(0.5f);
                            }
                            if(credit.getMaxPayTerm() > 15)            //si plazo excede el maximo, ajustar a ese valor
                            {
                                credit.setMaxPayTerm(15);
                            }
                            if(credit.getAnnualInterestRate() < 4.5f)      //si tasa de interes es menor al minimo, ajustar a ese valor
                            {
                                credit.setAnnualInterestRate(4.5D);
                            }
                            if(credit.getAnnualInterestRate() > 6.0f)      //si tasa de interes es mayor al maximo, ajustar a ese valor
                            {
                                credit.setAnnualInterestRate(6.0D);
                            }

                            finEvalFeignClient.saveCredit(credit);
                            break;

                    }
                    //para R6
                    User client = userFeignClient.findById(request.getUserId());
                    int clientAge = LocalDate.now().getYear() - LocalDate.parse(client.getBirthday()).getYear();
                    if( (75- (clientAge + credit.getMaxPayTerm())) >= 5) //Falla R6, solicitud rechazada
                    {
                        request.setStatus("E7");
                        finEvalFeignClient.save(request);
                    }
                    //para R7
                    String clientSavingCapacity = null; //'solida', 'moderada' o 'insuficiente'
                    int savingCapacityRules = 0;        //las reglas de R7 cumplidas
                    if(request.getBankAccountBalance() >= credit.getPropertyValue()*0.1f)
                    {
                        //cumple regla R71, punto positivo
                        savingCapacityRules++;
                    } //si no entra en este if, falla regla R71, punto negativo

                    if(request.getBiggestWithdrawalInLastYear() < (request.getBankAccountBalance()*0.5) )
                    {
                        //cumple regla R72, punto positivo
                        savingCapacityRules++;
                    } //si no entra en este if, falla regla R72, punto negativo
                    if(request.getTotalDepositsInLastYear() >= (request.getMonthlyClientIncome()*0.05) )
                    {
                        //cumple regla R73, punto positivo
                        savingCapacityRules++;
                    } //si no entra en este if, falla regla R73, punto negativo
                    if(request.getBankAccountAge() < 2)
                    {
                        if(request.getBankAccountBalance() >= (credit.getPropertyValue()*credit.getMaxFinanceAmount()*0.2) )
                        {
                            //cumple regla R74, punto positivo
                            savingCapacityRules++;
                        }
                        //si no entra en este if, falla regla R74, punto negativo
                    }
                    else    //request.getBankAccountAge >= 2
                    {
                        if(request.getBankAccountBalance() >= (credit.getPropertyValue()*credit.getMaxFinanceAmount()*0.1) )
                        {
                            //cumple regla R74, punto positivo
                            savingCapacityRules++;
                        }
                        //si no entra en este if, falla regla R74, punto negativo
                    }
                    if (request.getBiggestWithdrawalInLastSemester() < (credit.getPropertyValue()*credit.getMaxFinanceAmount()*0.3))
                    {
                        //cumple regla R75, punto positivo
                        savingCapacityRules++;
                    } //si no entra en este if, falla regla R75, punto negativo

                    //asignacion de 'clientSavingCapacity'
                    if(savingCapacityRules==5)
                    {
                        //cliente cumple las 5 reglas, capacidad de ahorro solida
                        clientSavingCapacity = "solida";
                    }
                    if(savingCapacityRules>=2 && savingCapacityRules<5)
                    {
                        //cliente cumple entre 2 y 4 reglas, capacidad de ahorro moderada, necesita revision adicional
                        clientSavingCapacity = "moderada";
                        request.setStatus("E3");
                        finEvalFeignClient.save(request);
                        return request;
                    }
                    if(savingCapacityRules < 2)
                    {
                        //cliente cumple menos de 2 reglas, capacidad de ahorro insuficiente, se rechaza solicitud
                        clientSavingCapacity = "insuficiente";
                        request.setStatus("E7");
                        finEvalFeignClient.save(request);
                        return request;
                    }

                    //solicitud cumple con condiciones requeridas R1-R7, pasa a estado E4 pre-aprobada
                    request.setStatus("E4");
                    finEvalFeignClient.save(request);
                    return request;


                }
                else //falta algun dato que se debia entregar en Registrar Solicitud
                {
                    request.setStatus("E1");
                    finEvalFeignClient.save(request);
                    return request;
                }
            }
        }
        else    //Request entregado no existe en BD
        {
            return request;
        }
    }


   public String findByUserId(Long userId)
   {
       User user = userFeignClient.findById(userId);
       return "exito";
   }

    public String findByFinEvalId(Long finEvalId)
    {
        FinEval finEval = finEvalFeignClient.findById(finEvalId);
        return "exito";
    }

    public String findByCreditId(Long creditId)
    {
        Credit credit = finEvalFeignClient.findByCreditId(creditId);
        return "exito";
    }

}
