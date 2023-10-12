from typing import NewType

##### Dynamically instancing class #####
class MyClass:
    def __init__(self, value):
        self.value = value

# Dictionary to store instances
instances = {}

# Create instances dynamically and store them in the dictionary
for i in range(5):
    variable_name = f"instance_{i}"  # Generating variable names like "instance_0", "instance_1", ...
    instances[variable_name] = MyClass(i)

# Access instances from the dictionary
for variable_name, instance in instances.items():
    print(f"{variable_name}: {instance.value}")

