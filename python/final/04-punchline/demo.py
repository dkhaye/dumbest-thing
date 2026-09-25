def silent():
    try:
        raise ValueError("boom")
    finally:
        return 2

print(silent())
