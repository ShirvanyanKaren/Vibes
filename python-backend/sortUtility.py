def bitonic_merge(arr, start, length, up):
    if length > 1:
        mid = length // 2
        for i in range(start, start + mid):
            if (arr[i] > arr[i + mid]) == up:
                arr[i], arr[i + mid] = arr[i + mid], arr[i]
        bitonic_merge(arr, start, mid, up)
        bitonic_merge(arr, start + mid, mid, up)

def bitonic_sort(arr, start, length, up):
    if length > 1:
        mid = length // 2
        bitonic_sort(arr, start, mid, True)
        bitonic_sort(arr, start + mid, mid, False)
        bitonic_merge(arr, start, length, up)

def bitonic_sort_wrapper(arr):
    n = len(arr)
    if n & (n - 1) != 0:
        raise ValueError("Array length must be a power of 2")
    bitonic_sort(arr, 0, n, True)
