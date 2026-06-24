package br.com.sisaudcon.saam.saam_sped_cnd;

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
import static org.hamcrest.Matchers.*;

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

    @BeforeEach
    void setUp() {
        resultadoRepository.deleteAll();
        clienteRepository.deleteAll();
        empresaRepository.deleteAll();

        Empresa empresa = new Empresa();
        empresa.setCnpj("12345678000199");
        empresa.setNomeEmpresa("Empresa Teste");
        empresa = empresaRepository.save(empresa);

        Cliente cliente = new Cliente();
        cliente.setCnpj("12345678000199");
        cliente.setEmpresa(empresa);
        cliente.setPeriodicidade(30);
        cliente.setStatusCliente("Ativo");
        clienteRepository.save(cliente);

        CndResultado resultado = new CndResultado();
        resultado.setCliente(cliente);
        resultado.setDataProcessamento(OffsetDateTime.now());
        resultado.setArquivo("Base64Content");
        resultado.setSituacao("Negativa");
        resultado.setOrgaoEmissor("Receita Federal");
        resultado.setTipoCertidao("Federal");
        resultado.setStatus("Concluído");
        resultadoRepository.save(resultado);
    }

    @Test
    void deveRetornarResultadoPorIdComNovosCampos() throws Exception {
        CndResultado resultado = resultadoRepository.findAll().get(0);

        mockMvc.perform(get("/resultados/" + resultado.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(resultado.getId().intValue())))
                .andExpect(jsonPath("$.orgaoEmissor", is("Receita Federal")))
                .andExpect(jsonPath("$.tipoCertidao", is("Federal")))
                .andExpect(jsonPath("$.arquivo", is("Base64Content")));
    }

    @Test
    void deveListarTodosComHasArquivo() throws Exception {
        mockMvc.perform(get("/resultados"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].hasArquivo", is(true)))
                .andExpect(jsonPath("$[0].orgaoEmissor", is("Receita Federal")));
    }
}
