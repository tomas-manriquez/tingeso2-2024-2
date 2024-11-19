package com.tingeso.m3_solicitud_credito.service;

import com.tingeso.m3_solicitud_credito.entity.CreditEntity;
import com.tingeso.m3_solicitud_credito.repository.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreditService {
    @Autowired
    CreditRepository creditRepository;

    public CreditEntity findById(Long id) {return creditRepository.findById(id).orElse(null);}

    public CreditEntity save(CreditEntity creditEntity) {return creditRepository.save(creditEntity);}

}
