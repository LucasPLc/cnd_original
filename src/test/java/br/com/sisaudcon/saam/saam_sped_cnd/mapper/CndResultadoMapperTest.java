package br.com.sisaudcon.saam.saam_sped_cnd.mapper;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.CndResultado;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.CndResultadoDTO;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CndResultadoMapperTest {

    private final CndResultadoMapper mapper = new CndResultadoMapper();

    @Test
    void shouldMapCndResultadoToDTO() {
        CndResultado entity = new CndResultado();
        entity.setId(1L);
        entity.setArquivo("base64content");
        entity.setOrgaoEmissor("RECEITA FEDERAL");
        entity.setTipoCertidao("FEDERAL");

        CndResultadoDTO dto = mapper.toDTO(entity);

        assertEquals(entity.getId(), dto.getId());
        assertEquals(entity.getArquivo(), dto.getArquivo());
        assertEquals(entity.getOrgaoEmissor(), dto.getOrgaoEmissor());
        assertEquals(entity.getTipoCertidao(), dto.getTipoCertidao());
        assertTrue(dto.isHasArquivo());
    }

    @Test
    void shouldHandleNullArquivo() {
        CndResultado entity = new CndResultado();
        entity.setArquivo(null);

        CndResultadoDTO dto = mapper.toDTO(entity);

        assertFalse(dto.isHasArquivo());
    }

    @Test
    void shouldHandleEmptyArquivo() {
        CndResultado entity = new CndResultado();
        entity.setArquivo(" ");

        CndResultadoDTO dto = mapper.toDTO(entity);

        assertFalse(dto.isHasArquivo());
    }
}
