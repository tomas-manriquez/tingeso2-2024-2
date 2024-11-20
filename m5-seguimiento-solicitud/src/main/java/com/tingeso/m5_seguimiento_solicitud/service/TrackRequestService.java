package com.tingeso.m5_seguimiento_solicitud.service;

import com.tingeso.m5_seguimiento_solicitud.clients.FinEvalFeignClient;
import com.tingeso.m5_seguimiento_solicitud.model.FinEval;
import org.springframework.stereotype.Service;

@Service
public class TrackRequestService {
   FinEvalFeignClient finEvalFeignClient;

   public TrackRequestService(FinEvalFeignClient finEvalFeignClient)
   {
       this.finEvalFeignClient = finEvalFeignClient;
   }

    //P5: Seguimiento de Solicitudes
    //Retorna el estado de una solicitud
    //Entrada: id de solicitud (Long)
    //Salida: estado de la solicitud (String)
    public String requestTracking (Long finEvalId)
    {
        FinEval request = finEvalFeignClient.findById(finEvalId);
        String status = request.getStatus();
        switch (status)
        {
            case "E1":
                status = "E1. En Revisión Inicial.";
                break;
            case "E2":
                status = "E2. Pendiente de Documentación." ;
                break;
            case "E3":
                status = "E3. En Evaluación.";
                break;
            case "E4":
                status = "E4. Pre-Aprobada.";
                break;
            case "E5":
                status = "E5. En Aprobación Final.";
                break;
            case "E6":
                status = "E6. Aprobada.";
                break;
            case "E7":
                status = "E7. Rechazada.";
                break;
            case "E8":
                status = "E8. Cancelada por el Cliente.";
                break;
            case "E9":
                status = "E9. En Desembolso.";
                break;
        }
        return status;
    }
}
