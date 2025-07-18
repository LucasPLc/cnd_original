package br.com.sisaudcon.saam.saam_sped_cnd.controller;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.EmpresaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @BeforeEach
    public void setUp() {
        clienteRepository.deleteAll();
        empresaRepository.deleteAll();
    }

    @Test
    public void deveRetornarIdNaListaDeClientes() throws Exception {
        Empresa empresa = new Empresa();
        empresa.setIdEmpresa("TESTE");
        empresa.setCnpj("00.000.000/0000-00");
        empresa.setNomeEmpresa("Empresa Teste");
        empresaRepository.save(empresa);

        Cliente cliente = new Cliente();
        cliente.setCnpj("06.988.594/0001-77");
        cliente.setPeriodicidade(30);
        cliente.setStatusCliente("ATIVO");
        cliente.setNacional(true);
        cliente.setMunicipal(true);
        cliente.setEstadual(false);
        cliente.setEmpresa(empresa);
        clienteRepository.save(cliente);

        mockMvc.perform(get("/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].cnpj").value("06.988.594/0001-77"));
    }
}
