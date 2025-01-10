const TodoList = require("./TodoList.js");
const TodoItem = require("./TodoItem.js");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const todoList = new TodoList();

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function addNewItem() {
  const title = await askQuestion("Enter the title of the new todo item: ");
  if (title.trim() === "") {
    console.log("Title cannot be empty. Please try again.\n");
  } else {
    const item = new TodoItem(title);
    todoList.addItem(item);
    console.log(`✅ Added new item: "${title}"\n`);
  }
}

async function markItemCompleted() {
  if (todoList.items.length === 0) {
    console.log("The list is empty. Add some items first.\n");
    return;
  }

  todoList.displayItemsWithStatus();
  const index = await askQuestion(
    "Enter the number of the item you wish to mark as completed: "
  );
  const indexInt = parseInt(index, 10) - 1; // Adjust index because user input starts from 1

  if (isNaN(indexInt) || indexInt < 0 || indexInt >= todoList.items.length) {
    console.log("❌ Invalid item number. Please try again.\n");
  } else {
    todoList.completeItem(indexInt);
    console.log(
      `✅ Item "${todoList.items[indexInt].title}" marked as completed.\n`
    );
  }
}

async function displayMenu() {
  console.log("\n==== Todo List Menu ====");
  console.log("1. Add a new todo item");
  console.log("2. Display all todo items with their status");
  console.log("3. Mark an item as completed");
  console.log("4. Exit");
  console.log("========================\n");
}

async function main() {
  let running = true;

  while (running) {
    await displayMenu();
    const choice = await askQuestion("Choose an action (1-4): ");

    switch (choice) {
      case "1":
        await addNewItem();
        break;
      case "2":
        if (todoList.items.length === 0) {
          console.log("The list is empty. Add some items to get started.\n");
        } else {
          console.log("\nYour Todo List:");
          todoList.displayItemsWithStatus();
          console.log("");
        }
        break;
      case "3":
        await markItemCompleted();
        break;
      case "4":
        running = false;
        console.log("👋 Exiting the application. Have a productive day!");
        break;
      default:
        console.log(
          "❌ Invalid choice. Please enter a number between 1 and 4.\n"
        );
    }
  }

  rl.close();
}

main().catch((err) => console.error("An unexpected error occurred:", err));
