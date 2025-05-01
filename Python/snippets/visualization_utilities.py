import matplotlib.pyplot as plt # Import the pyplot module from matplotlib, standard alias plt.

def plot_line_chart(x, y, title="Line Chart", xlabel="X-axis", ylabel="Y-axis", filename=None):
    """Plots a simple line chart using matplotlib and optionally saves it to a file.

    Args:
        x: Sequence of x-coordinates.
        y: Sequence of y-coordinates.
        title: Title of the chart.
        xlabel: Label for the x-axis.
        ylabel: Label for the y-axis.
        filename (str, optional): If provided, saves the plot to this file path instead of showing it.
    """
    # Create a new figure. plt.figure() can take arguments like figsize=(width, height).
    plt.figure()
    # Plot the y versus x values. marker='o' adds circle markers to data points.
    plt.plot(x, y, marker='o')
    # Set the title of the plot.
    plt.title(title)
    # Set the label for the x-axis.
    plt.xlabel(xlabel)
    # Set the label for the y-axis.
    plt.ylabel(ylabel)
    # Add a grid to the plot for better readability.
    plt.grid(True)
    
    # Check if a filename was provided for saving.
    if filename:
        # Save the figure to the specified file.
        # Common formats: .png, .jpg, .pdf, .svg
        plt.savefig(filename)
        print(f"Plot saved to {filename}")
        plt.close() # Close the plot figure to free up memory, especially important in loops.
    else:
        # Display the plot interactively.
        plt.show()

# Example Usage (can be commented out or removed)
# x_data = [1, 2, 3, 4, 5]
# y_data = [2, 3, 5, 7, 11]
# plot_line_chart(x_data, y_data, title="Prime Numbers", xlabel="Index", ylabel="Prime")
# plot_line_chart(x_data, y_data, title="Prime Numbers Plot", filename="primes.png")