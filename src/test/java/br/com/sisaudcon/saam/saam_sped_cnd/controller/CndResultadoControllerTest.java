package br.com.sisaudcon.saam.saam_sped_cnd.controller;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.CndResultadoRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.EmpresaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class CndResultadoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CndResultadoRepository resultadoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    private Long resultadoId;

    @BeforeEach
    void setUp() {
        resultadoRepository.deleteAll();
        clienteRepository.deleteAll();
        empresaRepository.deleteAll();

        Empresa empresa = new Empresa();
        empresa.setCnpj("11222333000100");
        empresa.setNomeEmpresa("Empresa Teste");
        empresa = empresaRepository.save(empresa);

        Cliente cliente = new Cliente();
        cliente.setCnpj("12345678000199");
        cliente.setPeriodicidade(30);
        cliente.setStatusCliente("Ativo");
        cliente.setNacional(true);
        cliente.setMunicipal(false);
        cliente.setEstadual(true);
        cliente.setEmpresa(empresa);
        cliente = clienteRepository.save(cliente);

        CndResultado resultado = new CndResultado();
        resultado.setDataProcessamento(OffsetDateTime.now());
        resultado.setArquivo("Base64Content");
        resultado.setSituacao("Negativa");
        resultado.setOrgaoEmissor("Receita Federal");
        resultado.setTipoCertidao("Federal");
        resultado.setStatus("Concluído");
        resultado.setCliente(cliente);
        resultado = resultadoRepository.save(resultado);

        resultadoId = resultado.getId();
    }

    @Test
    void deveRetornarResultadoDTOComArquivoAoBuscarPorId() throws Exception {
        mockMvc.perform(get("/resultados/" + resultadoId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(resultadoId))
                .andExpect(jsonPath("$.arquivo").value("Base64Content"))
                .andExpect(jsonPath("$.orgaoEmissor").value("Receita Federal"))
                .andExpect(jsonPath("$.clienteCnpj").value("12345678000199"));
    }

    @Test
    void deveRetornarHasArquivoNaListagemGeral() throws Exception {
        mockMvc.perform(get("/resultados")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].hasArquivo").value(true));
    }
}
