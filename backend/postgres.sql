CREATE TABLE groups (
	unique_group_id SERIAL PRIMARY KEY,
	group_id INT NOT NULL,
	leader_id INT NOT NULL,
  user_id INT NOT NULL,
  group_name VARCHAR NOT NULL,
  artist VARCHAR NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE
);


CREATE TABLE expenses (
	expense_id SERIAL PRIMARY KEY,
	group_id INT NOT NULL,
	leader_id INT NOT NULL,
  user_id INT NOT NULL,
  expense_name VARCHAR NOT NULL,
  total INT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE
);


CREATE TABLE expense_shares (
  id SERIAL PRIMARY KEY,
  expense_id INT REFERENCES expenses(expense_id),
  group_id INT NOT NULL,
  user_id INT REFERENCES users(user_id),
  amount_owed DECIMAL(10, 2),
  owes_to INT REFERENCES users(user_id)
);


