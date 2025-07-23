package br.com.sisaudcon.saam.saam_sped_cnd.integracao;

import br.com.sisaudcon.saam.saam_sped_cnd.dto.CredenciaisDbEmpresa;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.IntegracaoEmpresa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço dedicado a fornecer endpoints de diagnóstico para inspecionar
 * as respostas de serviços externos.
 */
@Service
public class EmpresaSaamService {

    private final IntegracaoService integrationService;

    @Autowired
    public EmpresaSaamService(IntegracaoService integrationService) {
        this.integrationService = integrationService;
    }

    /**
     * Realiza a busca de credenciais e, em seguida, a lista de empresas de integração
     * a partir dos serviços externos para um determinado ID de cliente.
     *
     * @param saamClientId O ID do cliente a ser diagnosticado.
     * @return A lista de empresas de integração retornada pelo webservice legado.
     */
    public List<IntegracaoEmpresa> obterListaDeEmpresasDoSaam(String saamClientId) {
        CredenciaisDbEmpresa credencial = integrationService.buscarCredenciaisEmpresaPorCliente(saamClientId);
        return integrationService.buscarBancosDeDadosEmpresa(credencial);
    }
}
