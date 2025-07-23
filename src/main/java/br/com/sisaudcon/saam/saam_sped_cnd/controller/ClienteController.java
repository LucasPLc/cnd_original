package br.com.sisaudcon.saam.saam_sped_cnd.controller;

import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNaoAutorizadoException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.exception.ClienteNotFoundException;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.model.Cliente;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.repository.ClienteRepository;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.service.ClienteService;
import br.com.sisaudcon.saam.saam_sped_cnd.domain.service.RegistroClienteService;
import br.com.sisaudcon.saam.saam_sped_cnd.dto.ClienteDTO;
import br.com.sisaudcon.saam.saam_sped_cnd.mapper.ClienteMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private static final Logger logger = LoggerFactory.getLogger(ClienteController.class);

    private final RegistroClienteService registroClienteService;
    private final ClienteRepository clienteRepository;
    private final ClienteService clienteService;

    public ClienteController(RegistroClienteService registroClienteService, ClienteRepository clienteRepository, ClienteService clienteService) {
        this.registroClienteService = registroClienteService;
        this.clienteRepository = clienteRepository;
        this.clienteService = clienteService;
    }

    private String getClientIdFromRequest(HttpServletRequest request) {
        String clientId = (String) request.getAttribute("clientId");
        if (clientId == null) {
            // Isso não deve acontecer se o filtro estiver configurado corretamente
            throw new ClienteNaoAutorizadoException("ClientId não encontrado no token.");
        }
        return clientId;
    }

    @GetMapping
    public List<ClienteDTO> listar(HttpServletRequest request) {
        logger.info(">>> ClienteController.listar() chamado");
        String clientId = getClientIdFromRequest(request);
        logger.info(">>> ClientId extraído do token: {}", clientId);

        List<Cliente> clientes = clienteRepository.findByEmpresa_IdEmpresa(clientId);
        logger.info(">>> {} clientes encontrados no banco de dados para o clientId {}.", clientes.size(), clientId);
        return clientes.stream()
                .map(ClienteMapper::toDTO)
                .toList();
    }

    @GetMapping("/{clienteId}")
    public ResponseEntity<ClienteDTO> buscar(@PathVariable Integer clienteId, HttpServletRequest request) {
        String tokenClientId = getClientIdFromRequest(request);
        if (!tokenClientId.equals(String.valueOf(clienteId))) {
            throw new ClienteNaoAutorizadoException("Acesso negado: o ID solicitado não corresponde ao do token.");
        }
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ClienteNotFoundException("Cliente não encontrado para o ID informado."));
        return ResponseEntity.ok(ClienteMapper.toDTO(cliente));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteDTO cadastrar(@RequestBody @Valid ClienteDTO clienteDTO, HttpServletRequest request) {
        // Para cadastro, a autorização pode ser mais complexa.
        // Por ora, vamos permitir que um token válido crie um cliente.
        // A lógica de negócio no service deve garantir as regras de associação corretas.
        getClientIdFromRequest(request); // Garante que há um token válido.

        Cliente cliente = ClienteMapper.toEntity(clienteDTO);
        Cliente clienteSalvo = registroClienteService.salvarClienteComEmpresa(cliente);
        return ClienteMapper.toDTO(clienteSalvo);
    }

    @PutMapping("/{clienteId}")
    public ClienteDTO atualizar(@PathVariable Integer clienteId,
                                @RequestBody @Valid ClienteDTO clienteDTO, HttpServletRequest request) {
        String tokenClientId = getClientIdFromRequest(request);
        if (!tokenClientId.equals(String.valueOf(clienteId))) {
            throw new ClienteNaoAutorizadoException("O ID na URL não corresponde ao do token.");
        }
        if (!clienteRepository.existsById(clienteId)) {
            throw new ClienteNotFoundException("Cliente não encontrado para o ID informado.");
        }
        Cliente cliente = ClienteMapper.toEntity(clienteDTO);
        cliente.setId(clienteId);
        Cliente atualizado = registroClienteService.salvarClienteComEmpresa(cliente);
        return ClienteMapper.toDTO(atualizado);
    }

    @DeleteMapping("/{clienteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Integer clienteId, HttpServletRequest request) {
        String tokenClientId = getClientIdFromRequest(request);
        if (!tokenClientId.equals(String.valueOf(clienteId))) {
            throw new ClienteNaoAutorizadoException("O ID na URL não corresponde ao do token.");
        }
        if (!clienteRepository.existsById(clienteId)) {
            throw new ClienteNotFoundException("Cliente não encontrado para o ID informado.");
        }
        registroClienteService.excluir(clienteId);
    }
}