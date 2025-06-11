package br.com.sisaudcon.saam.saam_sped_cnd.domain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cnd_resultado")
public class CndResultado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_cliente")
    private Cliente cliente;

    // Getters e setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}
