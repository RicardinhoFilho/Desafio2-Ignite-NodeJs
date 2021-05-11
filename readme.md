<h1>Desafio 02 - Trabalhando com Middleware</h1>

<ul>
    <li><strong>checkExistUserAccount</strong> : este middleware receberá o username do usuário pelo header dentro do request, e validar se existe ou não um usuário cadastrado com este username!</li>
    <li><strong>checksCreateTodosAvailability</strong>: este middleware é responsável por verificar se o usuário que receberá pelo request possui conta gratuita, se sim, devemos bloquear a criação de mais de 10 Todos!</li>
    <li>
        <strong>checksTodoExists</strong>: este middleware receberá um user de dentro do header e o id de um todo dentro de <code> request.params </code> e você deve validar o usuário, validar que o id seja um uuid e também validar qie esse id pertença a um todo do usuário informado!
    </li>
    <li>
        <strong>findUserById</strong>: este middleware buscará o usuário pelo seu id, recebido pelo header
    </li>
</ul>