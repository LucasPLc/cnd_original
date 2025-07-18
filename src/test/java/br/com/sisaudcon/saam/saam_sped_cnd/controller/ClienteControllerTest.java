package br.com.sisaudcon.saam.saam_sped_cnd.controller;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Empresa;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.service.ClienteService;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.ClienteDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.ClienteMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ClienteController.class)
public class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClienteService clienteService;

    @Test
    public void testBuscarClientePorCnpj() throws Exception {
        // Mock data
        Empresa empresa = new Empresa();
        empresa.setIdEmpresa("GLSAAM");
        empresa.setNomeEmpresa("Empresa Mock");
        empresa.setCnpj("00.000.000/0000-00");

        Cliente cliente = new Cliente();
        cliente.setId(1);
        cliente.setCnpj("06.988.594/0001-77");
        cliente.setPeriodicidade(30);
        cliente.setStatusCliente("ATIVO");
        cliente.setNacional(true);
        cliente.setMunicipal(true);
        cliente.setEstadual(false);
        cliente.setEmpresa(empresa);

        ClienteDTO clienteDTO = ClienteMapper.toDTO(cliente);

        when(clienteService.getClienteByCnpj("06.988.594/0001-77")).thenReturn(clienteDTO);

        mockMvc.perform(get("/clientes/buscar/06.988.594/0001-77"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.cnpj").value("06.988.594/0001-77"))
                .andExpect(jsonPath("$.periodicidade").value(30))
                .andExpect(jsonPath("$.statusCliente").value("ATIVO"))
                .andExpect(jsonPath("$.nacional").value(true))
                .andExpect(jsonPath("$.municipal").value(true))
                .andExpect(json.Path("$.estadual").value(false))
                .andExpect(jsonPath("$.empresa.idEmpresa").value("GLSAAM"))
                .andExpect(jsonPath("$.empresa.nomeEmpresa").value("Empresa Mock"))
                .andExpect(jsonPath("$.empresa.cnpj").value("00.000.000/0000-00"));
    }
}
