# Explicação do Código: Verificação de Número Primo

Este documento explica linha a linha o código Python presente no arquivo `num_primos.py`, que implementa uma função para verificar se um número é primo.

## Função `is_prime(n)`

```python
def is_prime(n):
```

- **Linha 1:** Define a função `is_prime` que recebe um parâmetro `n` (o número a ser verificado). A função retorna um valor booleano (`True` ou `False`).

```python
    """
    Verifica se um número é primo.
    
    Args:
        n (int): O número a ser verificado.
    
    Returns:
        bool: True se o número for primo, False caso contrário.
    """
```

- **Linhas 2-9:** Docstring da função, explicando o propósito, argumentos e retorno. Isso ajuda na documentação e no uso da função.

```python
    if n <= 1:
        return False
```

- **Linhas 10-11:** Verifica se `n` é menor ou igual a 1. Números primos são maiores que 1, então retorna `False` imediatamente.

```python
    if n <= 3:
        return True
```

- **Linhas 12-13:** Se `n` for 2 ou 3, retorna `True`, pois esses são números primos.

```python
    if n % 2 == 0 or n % 3 == 0:
        return False
```

- **Linhas 14-15:** Verifica se `n` é divisível por 2 ou 3. Se for, não é primo (exceto 2 e 3, que já foram tratados).

```python
    i = 5
```

- **Linha 16:** Inicializa a variável `i` com 5. A partir daqui, verificaremos divisores ímpares maiores que 3.

```python
    while i * i <= n:
```

- **Linha 17:** Loop enquanto `i` ao quadrado for menor ou igual a `n`. Isso otimiza a verificação, pois não precisamos verificar além da raiz quadrada de `n`.

```python
        if n % i == 0 or n % (i + 2) == 0:
            return False
```

- **Linhas 18-19:** Dentro do loop, verifica se `n` é divisível por `i` ou por `i + 2` (que são números consecutivos ímpares). Se for, retorna `False`.

```python
        i += 6
```

- **Linha 20:** Incrementa `i` em 6. Isso pula para o próximo conjunto de números ímpares (ex.: 5, 11, 17, etc.), otimizando o processo.

```python
    return True
```

- **Linha 21:** Se o loop terminar sem encontrar divisores, retorna `True`, indicando que `n` é primo.

## Seção de Testes

```python
# Testes
if __name__ == "__main__":
    test_cases = [1, 2, 3, 4, 5, 17, 18, 23, 29, 97]
    for num in test_cases:
        print(f"{num} é primo? {is_prime(num)}")
```

- **Linha 23:** Comentário indicando o início da seção de testes.
- **Linha 24:** Verifica se o script está sendo executado diretamente (não importado como módulo).
- **Linha 25:** Define uma lista de casos de teste com números variados.
- **Linhas 26-27:** Loop que testa cada número na lista e imprime o resultado usando f-strings.

Este algoritmo é eficiente para verificar números primos, com complexidade O(√n), evitando verificações desnecessárias.
