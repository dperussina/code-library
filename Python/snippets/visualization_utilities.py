import matplotlib.pyplot as plt

def plot_line_chart(x, y, title="Line Chart", xlabel="X-axis", ylabel="Y-axis"):
    """Plots a simple line chart."""
    plt.figure()
    plt.plot(x, y, marker='o')
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.grid(True)
    plt.show()