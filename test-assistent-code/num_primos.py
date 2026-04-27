def is_prime(n):
    """
    Verifica se um número é primo.
    
    Args:
        n (int): O número a ser verificado.
    
    Returns:
        bool: True se o número for primo, False caso contrário.
    """
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

# Testes
if __name__ == "__main__":
    test_cases = [1, 2, 3, 4, 5, 17, 18, 23, 29, 97]
    for num in test_cases:
        print(f"{num} é primo? {is_prime(num)}")
