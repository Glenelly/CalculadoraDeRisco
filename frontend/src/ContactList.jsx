import React, { useState } from "react";

const ContactList = ({ contacts, updateContact, updateCallback }) => {
    const [risco, setRisco] = useState({});
    const [erro, setErro] = useState("");

    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://127.0.0.1:5000/delete_contact/${id}`, options);
            if (response.status === 200) {
                updateCallback();
            } else {
                console.error("Failed to delete");
            }
        } catch (error) {
            alert(error);
        }
    };

    const calcularRisco = async (contact) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/calcular_risco", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    expressao: contact.expressao,
                    idade: contact.idade
                })
            });

            if (response.status === 400) {
                const data = await response.json();
                setErro(data.message);
                setRisco((prev) => ({ ...prev, [contact.id]: null }));
            } else if (response.status === 200) {
                const data = await response.json();
                setErro("");
                setRisco((prev) => ({ ...prev, [contact.id]: data }));
            } else {
                setErro("Erro desconhecido.");
            }
        } catch (error) {
            setErro("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div>
            <h2>Calculadora de Risco</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Expressão</th>
                        <th>Idade</th>
                        <th>Ações</th>
                        <th>Risco</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.nome}</td>
                            <td>{contact.expressao}</td>
                            <td>{contact.idade}</td>
                            <td>
                                <button onClick={() => updateContact(contact)}>Atualizar</button>
                                <button onClick={() => onDelete(contact.id)}>Deletar</button>
                                <button onClick={() => calcularRisco(contact)}>Calcular Risco</button>
                            </td>
                            <td>
                                {risco[contact.id] ? (
                                    <div>
                                        <p>Classe de Risco: {risco[contact.id].classe_risco}</p>
                                        <p>Mensagem: {risco[contact.id].mensagem}</p>
                                    </div>
                                ) : erro ? (
                                    <p style={{ color: "red" }}>{erro}</p>
                                ) : (
                                    <p>Nenhum cálculo realizado</p>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactList;
