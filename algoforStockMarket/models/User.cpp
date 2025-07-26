#include "User.hpp"
using namespace std;

User::User(int userId, const string& name, const string& email, double balance)
    : userId(userId), name(name), email(email), balance(balance) {}

int User::getUserId() const {
    return userId;
}

const string& User::getName() const {
    return name;
}

const string& User::getEmail() const {
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
