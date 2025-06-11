package br.com.sisaudcon.saam.saam_sped_cnd.domain.repository;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
//import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    //List<Cliente> findByNome(String nome);
    Optional<Cliente> findByCnpj(String cnpj);
}