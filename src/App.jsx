import { useState, useCallback, useEffect, isValidElement } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleAddFriend = (friend) => {
    setFriends((prev) => [...prev, friend]);
    setShowForm(false);
  };

  const handleSelection = (friend) => {
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowForm(false);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showForm && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
    </div>
  );
}

function Button({ children, onClick, type = "button" }) {
  return (
    <button onClick={onClick} className="button" type={type}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  console.log(isSelected);

  let message;
  if (friend.balance < 0) {
    message = `${friend.name} owes you $${Math.abs(friend.balance)}`;
  } else if (friend.balance > 0) {
    message = `You owe ${friend.name} $${friend.balance}`;
  } else {
    message = `You and ${friend.name} are even`;
  }

  return (
    <li className={isSelected ? "isSelected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance < 0 ? "green" : friend.balance > 0 ? "red" : ""
        }
      >
        {message}
      </p>
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;

    const newFriend = {
      id: Date.now(),
      name,
      image,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("");
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />

      <label>🖼️ Image URL</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
      />

      <Button type="submit">Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend }) {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💵 Bill value</label>
      <input type="number" min="0" />

      <label>🧍‍♂️ Your expense</label>
      <input type="number" min="0" />

      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="number" disabled />

      <label>🤑 Who is paying?</label>
      <select>
        <option value="user">You</option>
        <option value="selectedFriend">{selectedFriend.name}</option>
      </select>

      <Button type="submit">Split bill</Button>
    </form>
  );
}
