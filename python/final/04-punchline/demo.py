def finally_return():
    try:
        raise ValueError("boom")
    finally:
        return 2

print(finally_return())
