# Depuração do código debug.py

Este documento lista os erros encontrados no arquivo `debug.py` e descreve as correções aplicadas.

## Erros identificados

1. **Sintaxe incorreta na string de input do item 1**
   - Linha: `item1 = float(input(Preço do item 1? ))`
   - Problema: o prompt não estava entre aspas, portanto o Python interpreta `Preço` como um nome de variável e gera erro de sintaxe.
   - Correção: `item1 = float(input("Preço do item 1? "))`

2. **Tipo de dado incorreto em `desconto_cupom`**
   - Linha: `desconto_cupom = (input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))`
   - Problema: `input()` retorna uma string. Em seguida, o código tenta calcular `subtotal * (desconto_cupom / 100)` e comparar `desconto_cupom > 0`, o que causa erro de tipo.
   - Correção: converter o valor para `float`: `desconto_cupom = float(input(...))`

3. **Interpolação de string errada na impressão do item 2**
   - Linha: `print(" Item 2:        R$ {total_item2:.2f}")`
   - Problema: não foi usado `f-string`, então o placeholder `{total_item2:.2f}` é impresso literalmente.
   - Correção: `print(f" Item 2:        R$ {total_item2:.2f}")`

4. **Indentação incorreta no bloco `if`**
   - Linha: `if desconto_cupom > 0: 
print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")`
   - Problema: a linha de impressão não está indentada dentro do bloco `if`, causando erro de indentação.
   - Correção:
     ```python
     if desconto_cupom > 0:
         print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")
     ```

## Correções aplicadas

- Adicionei aspas ao prompt do `input` de `item1`.
- Converti `desconto_cupom` para `float` para permitir cálculos e comparações numéricas.
- Corrigi a impressão do item 2 para usar `f-string`.
- Ajustei a indentação do bloco `if desconto_cupom > 0:`.

## Resultado final

O código agora faz:
- leitura dos dados do cliente e dos itens;
- cálculo do subtotal, imposto e desconto;
- exibição do comprovante com valores formatados corretamente.

Se desejar, posso também refatorar o script para torná-lo mais modular e robusto.