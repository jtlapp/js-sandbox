function initialize() {
    // makeTextInput(inputID, inputTitle, optionalDefaultValue)
    // makeListInput(inputID, inputTitle, listOfOptions, optionalDefaultValue)

    makeTextInput("dog_name", "Dog's Name", "Fido");
    makeListInput("breed", "Breed", ["Lab", "Pug", "Rottie"], "Pug");
  }

  function compute() {
    // Set outputs values from inputs values.
    // Example: outputs.output_id = inputs.input_id

    outputs.about_dog = inputs.dog_name + " is a " + inputs.breed;
  }
