package br.com.sisaudcon.saam.saam_sped_cnd.controller;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.service.ClienteService;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.service.RegistroClienteService;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.ClienteDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.ClienteMapper;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Código Corrigido:
 * O construtor manual foi removido para evitar o conflito com a anotação @AllArgsConstructor do Lombok,
 * que já cria um construtor com todos os campos da classe.
 */
@AllArgsConstructor
@RestController
@RequestMapping("clientes")
public class ClienteController {

    private final RegistroClienteService registroClienteService;
    private final ClienteRepository clienteRepository;
    private final ClienteService clienteService;

    // O construtor manual que estava aqui foi removido.

    @GetMapping
    public List<ClienteDTO> listar() {
        List<Cliente> clientes = clienteRepository.findAll();
        return clientes.stream()
                .map(ClienteMapper::toDTO)
                .toList();
    }
    
    @GetMapping("/{clienteId}")
    public ResponseEntity<ClienteDTO> buscar(@PathVariable Integer clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado para o ID informado."));
        return ResponseEntity.ok(ClienteMapper.toDTO(cliente));
    }

    @GetMapping("/buscar")
    public ResponseEntity<ClienteDTO> buscarClientePorCnpj(@RequestParam String cnpj) {
        ClienteDTO clienteDTO = clienteService.getClienteByCnpj(cnpj);
        return ResponseEntity.ok(clienteDTO);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteDTO cadastrar(@RequestBody @Valid ClienteDTO clienteDTO) {
        Cliente cliente = ClienteMapper.toEntity(clienteDTO);
        Cliente clienteSalvo = registroClienteService.salvarClienteComEmpresa(cliente);
        return ClienteMapper.toDTO(clienteSalvo);
    }

    @PutMapping("/{clienteId}")
    public ClienteDTO atualizar(@PathVariable Integer clienteId,
                                @RequestBody @Valid ClienteDTO clienteDTO) {
        Cliente clienteAtual = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado para o ID informado."));

        // Atualiza os dados do cliente com os dados do DTO
        clienteAtual.setCnpj(clienteDTO.getCnpj());
        clienteAtual.setPeriodicidade(clienteDTO.getPeriodicidade());
        clienteAtual.setStatusCliente(clienteDTO.getStatusCliente());
        clienteAtual.setNacional(clienteDTO.getNacional());
        clienteAtual.setMunicipal(clienteDTO.getMunicipal());
        clienteAtual.setEstadual(clienteDTO.getEstadual());

        // A lógica de salvar a empresa associada já está no serviço
        if (clienteDTO.getEmpresa() != null) {
            clienteAtual.getEmpresa().setIdEmpresa(clienteDTO.getEmpresa().getIdEmpresa());
            clienteAtual.getEmpresa().setNomeEmpresa(clienteDTO.getEmpresa().getNomeEmpresa());
            clienteAtual.getEmpresa().setCnpj(clienteDTO.getEmpresa().getCnpj());
        }

        Cliente clienteSalvo = registroClienteService.salvarClienteComEmpresa(clienteAtual);
        return ClienteMapper.toDTO(clienteSalvo);
    }
    
    @DeleteMapping("/{clienteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Integer clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new ClienteNotFoundException("Cliente não encontrado para o ID informado.");
        }
        registroClienteService.excluir(clienteId);
    }
}