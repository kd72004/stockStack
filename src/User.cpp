#include "User.hpp"

User::User(int userId, const std::string& name, const std::string& email, double balance)
    : userId(userId), name(name), email(email), balance(balance) {}

int User::getUserId() const {
    return userId;
}

const std::string& User::getName() const {
    return name;
}

const std::string& User::getEmail() const {
    return email;
}

double User::getBalance() const {
    return balance;
}

void User::deposit(double amount) {
    balance += amount;
}

bool User::withdraw(double amount) {
    if (amount > balance) return false;
    balance -= amount;
    return true;
}
