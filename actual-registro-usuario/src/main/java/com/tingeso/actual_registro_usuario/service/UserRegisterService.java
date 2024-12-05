package com.tingeso.actual_registro_usuario.service;

import com.tingeso.actual_registro_usuario.entity.UserEntity;
import com.tingeso.actual_registro_usuario.repository.UserRegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserRegisterService {
    @Autowired
    UserRegisterRepository userRegisterRepository;

    //P2: Registro de usuario
    //Verifica datos basicos de usuario, y si son validos, habilita documentos a ejecutivos para validacion
    //Entrada: objeto ClientEntity
    //Salida: clientEntity actualizado. Como efecto secundario, actualiza el atributo 'status' segun ...
    // validez de datos minimos y que los documentos sean validos para registrar un usuario
    public UserEntity userRegister(UserEntity client) {
        //verificar que no este previamente registrado
        if(!client.getStatus().equals("validado"))
        {
            LocalDate birthday = LocalDate.parse(client.getBirthday());

            if(birthday.isBefore(LocalDate.now().minusYears(18)))
            {
                if(client.getDocumentsIds().isEmpty() )
                {
                    client.setStatus("espera");
                    userRegisterRepository.save(client);
                }
                else
                {
                    if(client.isHasValidDocuments())
                    {
                        client.setStatus("validado");
                        userRegisterRepository.save(client);
                    }
                    else
                    {
                        client.setStatus("espera");
                        userRegisterRepository.save(client);
                    }
                }
            }
        }
        return client;
    }

    public UserEntity findById(Long id) {return userRegisterRepository.findById(id).orElse(null);}

    public List<UserEntity> findAll() {return userRegisterRepository.findAll();}

    public void delete(UserEntity user) { userRegisterRepository.delete(user);}

    public UserEntity save(UserEntity user) {return userRegisterRepository.save(user);}
}
