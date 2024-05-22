const inputContainer = document.querySelector('.input');
        const cepInput = document.getElementById('cep');
        const btnSearch = document.querySelector('#btn-search');
        const resultContainer = document.getElementById('results-container');

        let cep = '';

        cepInput.addEventListener('keyup', (e) => {
            formatCep(e);
            clearErrors();
        });
        btnSearch.addEventListener('click', getCep);

        function formatCep(e) {
            cep = e.target.value.replace(/\D/g, '');
            e.target.value = cep;
        }

        function getCep() {
            if (!isCepValid(cep)) {
                addErrorMessage();
                return;
            }

            resultContainer.innerHTML = '<p class="loading">Carregando...</p>';

            fetch(`https://viacep.com.br/ws/${cep}/json/`, {
                method: "GET",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    resultContainer.innerHTML = "";
                    if (data.erro) {
                        addErrorMessage('CEP não encontrado');
                    } else {
                        resultContainer.appendChild(createResultCard(data));
                    }
                })
                .catch((error) => {
                    console.log("error", error);
                    resultContainer.innerHTML = "";
                    addErrorMessage('Erro ao buscar CEP');
                });
        }

        function isCepValid(cep) {
            const regexCep = /^[0-9]{8}$/;
            return regexCep.test(cep);
        }

        function createResultCard(data) {
            const card = document.createElement('div');
            card.className = 'card';

            const title = document.createElement('h2');
            title.className = 'result-title';
            title.textContent = 'Resultado';

            card.appendChild(title);

            card.appendChild(createField('CEP', data.cep || 'N/A'));
            card.appendChild(createField('Estado', data.uf || 'N/A'));
            card.appendChild(createField('Cidade', data.localidade || 'N/A'));
            card.appendChild(createField('Bairro', data.bairro || 'N/A'));
            card.appendChild(createField('Logradouro', data.logradouro || 'N/A'));

            return card;
        }

        function createField(name, value) {
            const field = document.createElement('div');
            field.className = 'field';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'name-field';
            nameSpan.textContent = name + ': ';
            const valueSpan = document.createElement('span');
            valueSpan.className = 'response-field';
            valueSpan.textContent = value;
            field.appendChild(nameSpan);
            field.appendChild(valueSpan);
            return field;
        }

        function addErrorMessage(message = 'CEP inválido') {
            const errorAlreadyExists = document.querySelector('.error-message');
            if (errorAlreadyExists) {
                errorAlreadyExists.textContent = message;
                return;
            }

            const small = document.createElement('small');
            small.className = 'error-message';
            small.textContent = message;
            inputContainer.appendChild(small);

            cepInput.classList.add('input-error');
        }

        function clearErrors() {
            cepInput.classList.remove('input-error');
            const small = document.querySelector('.error-message');
            if (small) {
                small.remove();
            }
        }