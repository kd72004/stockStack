#pragma once
#include <string>

class User {
public:
    User(int userId, const std::string& name, const std::string& email, double balance);

    int getUserId() const;
    const std::string& getName() const;
    const std::string& getEmail() const;
    double getBalance() const;

    void deposit(double amount);
    bool withdraw(double amount);

private:
    int userId;
    std::string name;
    std::string email;
    double balance;
};
