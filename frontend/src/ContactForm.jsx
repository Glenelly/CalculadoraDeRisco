import { useState } from "react";

const ContactForm = ({ existingContact = {}, updateCallback }) => {
    const [nome, setNome] = useState(existingContact.nome || "");
    const [expressao, setExpressao] = useState(existingContact.expressao || 0);
    const [idade, setIdade] = useState(existingContact.idade || 0);

    const updating = Object.entries(existingContact).length !== 0;
    const apiUrl = import.meta.env.VITE_API_URL;

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            nome,
            expressao,
            idade
        };

        const url = `${apiUrl}/${updating ? `update_contact/${existingContact.id}` : "create_contact"}`;
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json();
            alert(data.message);
        } else {
            updateCallback();
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="nome">Nome:</label>
                <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="expressao">Expressão:</label>
                <input
                    type="number"
                    id="expressao"
                    value={expressao}
                    onChange={(e) => setExpressao(parseInt(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="idade">Idade:</label>
                <input
                    type="number"
                    id="idade"
                    value={idade}
                    onChange={(e) => setIdade(parseInt(e.target.value))}
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default ContactForm;
