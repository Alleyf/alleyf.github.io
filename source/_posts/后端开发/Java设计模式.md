---
title: Java设计模式
date: 2024-05-12 10:54:15
tags:
  - Java
  - 设计模式
sticky: 80
excerpt: 
author: fcs
index_img: https://picsum.photos/800/250
lang: zh-CN
number headings: auto, first-level 1, max 5, start-at 1, 1.1
---

![](https://picsum.photos/800/250)

# 1 面向对象设计原则

在软件开发过程中，确保项目的基本业务功能是首要任务，但同样重要的是考虑项目的可维护性和可复用性。一个良好的架构设计不仅能够支持当前的业务需求，而且能够适应未来的变化，允许其他开发者加入并共同维护项目。以下是一些面向对象设计原则，它们可以帮助我们构建一个更加健壮、灵活和可维护的软件系统：

1. **单一职责原则（Single Responsibility Principle, SRP）**：每个类应该只有一个引起它变化的原因，即一个类只负责一项职责。
2. **开放-封闭原则（Open-Closed Principle, OCP）**：软件实体应当对扩展开放，对修改封闭。这意味着设计时应当使软件模块易于扩展，但是不需要修改现有代码。
3. **里氏替换原则（Liskov Substitution Principle, LSP）**：子类型必须能够替换掉它们的父类型，即基类可以被子类无缝替换，而不影响程序的行为。
4. **依赖倒置原则（Dependency Inversion Principle, DIP）**：高层模块不应依赖于低层模块，两者都应该依赖于抽象。抽象不应依赖于细节，细节应依赖于抽象。
5. **接口隔离原则（Interface Segregation Principle, ISP）**：客户端不应该依赖它不需要的接口；一个类对另一个类的依赖应该建立在最小的接口上。
6. **迪米特法则（Law of Demeter, LoD）**：一个对象应该对其他对象有最少的了解，只与直接的伙伴类通信。
7. **合成/聚合复用原则（Composite/Aggregate Reuse Principle, CARP）**：尽量使用对象的组合/聚合，而不是通过继承关系建立新的功能。
8. **最少知识原则（Principle of Least Knowledge, POLK）**：一个对象应该对其他对象有最少的了解，只与直接的伙伴类通信。
9. **SOLID原则**：上述原则的集合，是面向对象设计的核心。

我们应该在设计阶段就将这些原则融入到我们的架构中，以确保软件的可维护性和可扩展性。同时，我们还需要制定清晰的编码规范和文档标准，以帮助团队成员理解并遵循这些原则。通过这些方法，我们可以避免项目变成难以维护的“屎山”，确保软件系统能够稳定、可靠地运行，即使在不断变化的需求和不断扩展的团队中也是如此。

## 1.1 单一职责原则

单一职责原则（Single Responsibility Principle, SRP）是面向对象设计原则之一，它的核心思想是：一个类应该只有一个原因引起它的变更，即一个类只应该负责一个功能。

单一职责原则强调的是类的功能专一性。在软件设计中，如果一个类承担了多个职责，那么当其中一个职责发生变化时，可能会影响其他职责的实现。这会导致类变得难以理解和维护。相反，如果一个类只负责一个职责，那么当需要修改时，我们可以清楚地知道这个修改只会影响这个特定的职责，而不会影响到其他部分。

> 核心在于`将类以最细的粒度进行拆分，只负责单一职责`。

### 1.1.1 代码示例：

假设我们有一个处理用户订单的系统，如果按照单一职责原则，我们不应该让订单类同时负责订单的创建、支付、发货等所有功能。以下是违反和遵循单一职责原则的两个例子：

#### 1.1.1.1 违反单一职责原则的示例：

```java
public class Order {
    private double amount;
    private boolean paid;
    private boolean shipped;

    public void createOrder(double amount) {
        this.amount = amount;
        // 创建订单的逻辑
    }

    public void payOrder() {
        this.paid = true;
        // 支付订单的逻辑
    }

    public void shipOrder() {
        this.shipped = true;
        // 发货订单的逻辑
    }

    // 其他与订单相关的功能...
}
```

在这个例子中，`Order` 类承担了创建、支付和发货等多个职责，违反了单一职责原则。

#### 1.1.1.2 遵循单一职责原则的示例：

```java
public interface OrderService {
    void createOrder(double amount);
}

public class OrderCreationService implements OrderService {
    public void createOrder(double amount) {
        // 创建订单的逻辑
    }
}

public interface PaymentService {
    void payOrder();
}

public class OrderPaymentService implements PaymentService{
    public void payOrder() {
        // 支付订单的逻辑
    }
}

public interface ShippingService {
    void shipOrder();
}

public class OrderShippingService implements ShippingService{
    public void shipOrder() {
        // 发货订单的逻辑
    }
}
```

在这个例子中，我们创建了三个不同的类（`OrderCreationService`、`PaymentService`、`ShippingService`），每个类负责订单处理的一个特定职责。这样，每个类都只关注一个功能，符合单一职责原则。

通过这种方式，我们可以更容易地理解和维护每个类，同时也提高了代码的可测试性和可复用性。

## 1.2 开闭原则

> 软件实体应当对扩展开放，对修改关闭。
> 抽象顶层行为为抽象类或接口，有具体实现或派生类去重写方法实现不同的逻辑。

开闭原则（Open-Closed Principle, OCP）是面向对象编程中的一个核心设计原则，由Bertrand Meyer在1988年提出，并由Robert C. Martin在《敏捷软件开发：原则、模式与实践》中进一步推广。开闭原则的核心思想是：

- **软件实体应当对扩展开放（提供方）**：意味着软件模块应该允许在不修改现有代码的基础上扩展其功能。
- **对修改封闭（调用方）**：意味着当需求变化时，应该避免修改现有代码，而应该通过扩展来满足新的需求。
开闭原则鼓励开发者设计出灵活且可维护的系统。遵循开闭原则的系统能够在不修改现有代码的情况下，通过添加新的代码来实现功能的扩展。这通常涉及到使用抽象和多态性来设计系统。

当需求变化时，系统应该能够通过添加新的代码来适应这些变化，而不是去修改现有的、已经经过测试的代码。这样可以减少引入新bug的风险，并且可以提高代码的可维护性和可扩展性。

### 1.2.1 Java代码示例：

下面是一个遵循开闭原则的例子，我们考虑一个简单的图形接口和几个实现该接口的具体图形类。

#### 1.2.1.1 抽象基类或接口：

```java
public interface Shape {
    double area();
}
```

#### 1.2.1.2 具体实现类：

```java
public class Circle implements Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle implements Shape {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }
}
```

现在，假设我们需要计算一个图形的面积，我们可以编写一个不依赖于具体图形类型的函数：

#### 1.2.1.3 客户端代码：

```java
public class ShapeCalculator {
    public double calculateArea(Shape shape) {
        return shape.area();
    }
}
```

当我们需要添加一个新的图形类型时，比如三角形，我们可以这样做：

#### 1.2.1.4 新的图形实现类：

```java
public class Triangle implements Shape {
    private double base;
    private double height;

    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }

    @Override
    public double area() {
        return 0.5 * base * height;
    }
}
```

我们不需要修改`ShapeCalculator`类或`Shape`接口，就可以计算三角形的面积。这展示了开闭原则的“对扩展开放，对修改封闭”的特性。

通过使用接口和抽象类，我们可以设计出灵活的系统，使得在添加新的功能时，不需要对现有的、经过测试的代码进行修改。这样的设计不仅提高了代码的可维护性，而且也提高了软件的稳定性和可靠性。

## 1.3 里氏替换原则

里氏替换原则（Liskov Substitution Principle, LSP）是面向对象编程中的一个核心设计原则，由Barbara Liskov在1987年提出。这个原则主要讨论了基类（父类）和派生类（子类）之间的关系。里氏替换原则的核心思想是：

- **子类型必须能够替换掉它们的父类型**：派生类的对象应该能够在不改变程序行为的前提下，替换掉基类的对象。

> 派生类不能重写父类已实现的方法，只能重写未实现的抽象方法。

### 1.3.1 结构清晰的文本描述：

里氏替换原则强调的是派生类（子类）应当是基类（父类）的完美替代品。这意味着派生类可以扩展基类的功能，但不能改变基类原有的行为。换句话说，任何基类的对象都应该能够被其派生类的对象所替换，而程序的行为不应该因为这种替换而发生改变。

这个原则有助于维护类的层次结构的稳定性，确保在类的继承关系中，子类不会破坏父类已经定义的行为。这有助于提高代码的可维护性和可扩展性。

### 1.3.2 Java代码示例：

下面是一个违反里氏替换原则的例子，以及一个遵循该原则的修正例子。

#### 1.3.2.1 违反里氏替换原则的示例：

```java
public class Bird {
    public void fly() {
        System.out.println("I am flying");
    }
}

public class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguin can't fly");
    }
}

public class AnimalTest {
    public void testFly(Bird bird) {
        bird.fly(); // 这里假设我们想要测试一个Bird对象是否能飞
    }
}

// 如果我们尝试用Penguin对象来调用testFly方法，将会抛出异常
```

在这个例子中，`Penguin` 类是 `Bird` 类的子类，但是它不能“飞”，这违反了里氏替换原则，因为 `Penguin` 对象不能替换 `Bird` 对象使用。

#### 1.3.2.2 遵循里氏替换原则的修正示例：

为了修正这个问题，我们可以将不能飞的鸟类从 `Bird` 类中分离出来，创建一个新的基类 `Animal`，然后将 `Bird` 和 `Penguin` 都作为 `Animal` 的子类。

```java
public class Animal {
    // 所有动物共有的方法
}

public class Bird extends Animal {
    public void fly() {
        System.out.println("I am flying");
    }
}

public class Penguin extends Animal {
    // Penguin 不需要fly方法，因为它不会飞
}

public class AnimalTest {
    public void testFly(Bird bird) {
        bird.fly(); // 现在只有能够飞的鸟类才有fly方法
    }
    
    public void testAnimal(Animal animal) {
        // 可以对所有动物进行的操作
    }
}

// 现在我们可以安全地使用testAnimal方法来测试Penguin对象
```

在这个修正后的例子中，`Bird` 类和 `Penguin` 类都是 `Animal` 的子类，但是只有 `Bird` 类有 `fly` 方法。这样，任何 `Bird` 对象都可以替换 `Animal` 对象，而 `Penguin` 对象也不会被错误地传递到需要 `fly` 方法的地方，从而遵循了里氏替换原则。

## 1.4 依赖倒转原则

依赖倒置原则（Dependency Inversion Principle, DIP）是面向对象设计中的一个关键原则，由Robert C. Martin提出，是SOLID原则中的“D”。它包含两个基本的条款：

1. **高层模块不应依赖于低层模块**：高层模块（如应用程序层）应该基于抽象，而不是依赖于具体的实现细节。
2. **两个模块都应该依赖于抽象**：抽象不应该依赖于细节，而细节应该依赖于抽象。

### 1.4.1 结构清晰的文本描述：

依赖倒置原则鼓励我们通过定义抽象接口或抽象类来实现模块间的松耦合。这样做的好处是，当底层实现发生变化时，高层模块不需要做任何修改，只要接口保持不变。

在实践中，这意味着：

- 高层模块定义业务规则，但不直接依赖于具体的类实现。
- 所有的依赖关系都通过抽象发生，而不是通过具体的类。
- 实现细节应实现这些抽象，高层模块只与这些抽象交互。

### 1.4.2 Java代码示例：

下面是一个违反依赖倒置原则的例子，以及一个遵循该原则的修正例子。

#### 1.4.2.1 违反依赖倒置原则的示例：

```java
public class OrderReport {
    private DatabaseOrderRepository repository;

    public OrderReport() {
        repository = new DatabaseOrderRepository(); // 依赖于具体的实现
    }

    public void generate() {
        // 使用repository生成报告
    }
}

class DatabaseOrderRepository {
    // 数据库操作的具体实现
}
```

在这个例子中，`OrderReport` 高层模块直接依赖于 `DatabaseOrderRepository` 这个低层模块的具体实现。

#### 1.4.2.2 遵循依赖倒置原则的修正示例：

```java
public interface OrderRepository {
    // 定义了所有订单存储库必须实现的抽象方法
    List<Order> getAllOrders();
}

public class OrderReport {
    private OrderRepository repository;

    public OrderReport(OrderRepository repository) {
        this.repository = repository; // 现在依赖于抽象
    }

    public void generate() {
        // 使用repository生成报告，具体实现细节被隐藏
    }
}

class DatabaseOrderRepository implements OrderRepository {
    // 实现了OrderRepository接口，提供了数据库操作的具体实现
    @Override
    public List<Order> getAllOrders() {
        // 从数据库获取订单列表
        return null;
    }
}

// 客户端代码
class Client {
    public static void main(String[] args) {
        OrderRepository repository = new DatabaseOrderRepository();
        OrderReport report = new OrderReport(repository);
        report.generate();
    }
}
```

在这个修正后的例子中，`OrderReport` 依赖于一个抽象的 `OrderRepository` 接口，而不是任何具体实现。这样，如果将来我们需要将存储库从数据库更换为文件系统或其他形式，我们只需要提供一个新的 `OrderRepository` 实现，而不需要修改 `OrderReport` 类或客户端代码。

通过这种方式，依赖倒置原则帮助我们创建了更加灵活和可维护的系统。

## 1.5 接口隔离原则

接口隔离原则（Interface Segregation Principle, ISP）是面向对象设计中的一个核心原则，它是SOLID原则中的“I”。接口隔离原则的核心思想是：

- **客户端不应该依赖它不需要的接口**：一个类对另一个类的依赖应该建立在最小的接口上。
- **接口应该根据客户端的需要来设计**，而不应该强迫客户端依赖于它不需要的方法。

### 1.5.1 结构清晰的文本描述：

接口隔离原则鼓励设计者创建更小、更具体的接口，而不是庞大而通用的接口。这样做的目的是减少客户端（使用接口的对象）与接口之间的耦合度，使得客户端只需要知道和使用它关心的方法。

遵循接口隔离原则可以带来以下好处：

- **减少客户端的实现负担**：客户端不必实现接口中所有方法，只需要实现它需要的方法。
- **提高系统的灵活性**：当接口需要变更时，对客户端的影响更小。
- **提高可维护性**：更小的接口更容易理解和维护。

### 1.5.2 Java代码示例：

下面是一个违反接口隔离原则的例子，以及一个遵循该原则的修正例子。

#### 1.5.2.1 违反接口隔离原则的示例：

```java
public interface Animal {
    void eat();
    void fly();
    void swim();
}

class Bird implements Animal {
    @Override
    public void eat() {
        // 鸟吃东西的逻辑
    }

    @Override
    public void fly() {
        // 鸟飞的逻辑
    }

    @Override
    public void swim() {
        // 错误：不是所有鸟都会游泳
    }
}

class Fish implements Animal {
    @Override
    public void eat() {
        // 鱼吃东西的逻辑
    }

    @Override
    public void fly() {
        // 错误：鱼不会飞
    }

    @Override
    public void swim() {
        // 鱼游泳的逻辑
    }
}
```

在这个例子中，`Animal` 接口强迫所有的实现类都必须提供 `eat()`, `fly()`, 和 `swim()` 方法，这导致 `Bird` 和 `Fish` 类都必须实现它们不需要的方法，违反了接口隔离原则。

#### 1.5.2.2 遵循接口隔离原则的修正示例：

```java
public interface Eatable {
    void eat();
}

public interface Flyable {
    void fly();
}

public interface Swimmable {
    void swim();
}

class Bird implements Eatable, Flyable {
    @Override
    public void eat() {
        // 鸟吃东西的逻辑
    }

    @Override
    public void fly() {
        // 鸟飞的逻辑
    }
    // 不需要实现swim方法
}

class Fish implements Eatable, Swimmable {
    @Override
    public void eat() {
        // 鱼吃东西的逻辑
    }

    @Override
    public void swim() {
        // 鱼游泳的逻辑
    }
    // 不需要实现fly方法
}
```

在这个修正后的例子中，我们将 `Animal` 接口分解为三个更小的接口：`Eatable`, `Flyable`, 和 `Swimmable`。现在，`Bird` 和 `Fish` 类只需要实现它们需要的接口，而不需要实现它们不需要的方法。这样，每个类都只依赖于它实际使用的接口，符合接口隔离原则。

## 1.6 合成复用原则

合成/聚合复用原则（Composite/Aggregate Reuse Principle, CARP）是面向对象设计中的一个原则，它强调通过组合/聚合来实现代码的复用，而不是通过继承。这个原则是SOLID原则之外的一个补充，它有助于创建更灵活和更易于维护的系统。

### 1.6.1 结构清晰的文本描述：

合成复用原则的核心思想是：

- **优先使用对象的组合/聚合**：在系统中，应当通过将对象组合成树形结构来实现代码的复用，而不是通过让一个类继承另一个类。
- **继承应该谨慎使用**：继承是一种强耦合关系，它使得子类与父类紧密相连。当父类发生变化时，所有子类都可能受到影响。因此，应当在确实需要表示一个“是一个”（is-a）关系时才使用继承。

遵循合成复用原则可以带来以下好处：

- **降低类之间的耦合度**：对象的组合/聚合关系比继承关系更松散，更灵活。
- **提高系统的可维护性**：当需要修改系统时，只需要修改组合/聚合中的一个部分，而不需要修改整个继承体系。
- **提高代码的可复用性**：通过组合/聚合，可以创建更通用的组件，这些组件可以在不同的上下文中被复用。

### 1.6.2 Java代码示例：

下面是一个遵循合成复用原则的例子：

#### 1.6.2.1 使用继承实现的示例（不推荐）：

```java
public class Employee {
    // 员工的共有属性和方法
}

public class Manager extends Employee {
    // 经理特有的属性和方法
}
```

在这个例子中，`Manager` 通过继承 `Employee` 来实现代码的复用。这种做法在 `Employee` 发生变化时可能会导致 `Manager` 也需要做相应的修改。

#### 1.6.2.2 使用组合/聚合实现的示例（推荐）：

```java
public class Employee {
    // 员工的共有属性和方法
}

public class Manager {
    private Employee employee; // 组合Employee对象

    public Manager(Employee employee) {
        this.employee = employee;
    }

    // 经理特有的属性和方法
    // 使用employee对象的方法来实现一些功能
}
```

在这个例子中，`Manager` 类通过组合一个 `Employee` 对象来实现代码的复用。`Manager` 可以复用 `Employee` 的功能，同时又保持了与 `Employee` 的松耦合关系。当 `Employee` 发生变化时，只要组合关系保持不变，`Manager` 就不需要做任何修改。

通过这种方式，合成复用原则鼓励我们通过组合/聚合来构建系统，而不是依赖继承，从而创建出更灵活、更易于维护的软件设计。

## 1.7 迪米特法则

迪米特法则（Law of Demeter, LoD）是一种软件设计原则，旨在减少类之间的耦合。这个原则的核心思想是：一个对象应该对其他对象有最少的了解，只与直接的伙伴类通信。它通常用于指导如何在一个面向对象程序中进行类的设计和交互。

### 1.7.1 迪米特法则的规则：
1. 一个对象应该只与它的直接朋友交互。
2. 对象的朋友包括：
   - 它本身（`this`）
   - 以参数形式传入的对象
   - 创建的对象
   - 由该对象的实例变量直接持有的对象

迪米特法则有助于减少系统中不同部分之间的依赖关系，从而使得各个部分可以独立地开发和测试。遵循迪米特法则的代码更容易维护和扩展，因为每个类只关注自己的职责，而不是依赖于系统中的其他类。

> 尽量只依赖于最细粒度的参数，能传基本类型就不传对象，能用直接方法就不要进一步调用。

### 1.7.2 Java代码示例：

下面是一个违反迪米特法则的例子，以及一个遵循该法则的修正例子。

#### 1.7.2.1 违反迪米特法则的示例：

```java
public class Person {
    private String name;
    // 省略其他属性和方法
    public String getName() {
        return name;
    }
}

public class Company {
    public void printPersonName(Person person) {
        System.out.println(person.getName()); // 正确
        System.out.println(person.getName().length()); // 违反LoD，因为对getName的返回值进行了操作
    }
}
```

在这个例子中，`Company`类不仅使用了`Person`对象的`getName`方法，还进一步调用了`String`对象的方法来获取名字的长度。这违反了迪米特法则，因为`Company`类对`Person`对象的内部细节（即名字字符串的长度）有了解。

#### 1.7.2.2 遵循迪米特法则的修正示例：

为了遵循迪米特法则，我们可以修改`Person`类，使其提供所需信息的长度，而不是让`Company`类去获取。

```java
public class Person {
    private String name;
    // 省略其他属性和方法
    public String getName() {
        return name;
    }

    // 新增方法，提供名字的长度信息
    public int getNameLength() {
        return name.length();
    }
}

public class Company {
    public void printPersonName(Person person) {
        System.out.println(person.getName()); // 正确
        System.out.println(person.getNameLength()); // 遵循LoD，Person类提供名字长度
    }
}
```

在这个修正后的例子中，`Company`类通过调用`Person`对象的`getNameLength`方法来获取名字的长度，而不是直接操作`getName`方法返回的字符串。这样，`Company`类就不需要了解`Person`对象内部的实现细节，符合迪米特法则的要求。

通过这种方式，迪米特法则有助于我们设计出松耦合、高内聚的类，使得代码更易于理解和维护。

# 2 设计模式

设计模式是软件工程中常用的解决特定问题的模板。它们分为三大类：**创建型（Creational）、结构型（Structural）和行为型（Behavioral）**。

## 2.1 创建型

创建型设计模式主要关注对象的创建过程，封装对象的创建逻辑，并从具体实现中解耦，以使程序更加灵活。

以下是几种常见的创建型设计模式：

1. **单例模式（Singleton）**：确保一个类只有一个实例，并提供一个全局访问点。
2. **工厂方法模式（Factory Method）**：定义一个接口用于创建对象，让子类决定要实例化的类是哪一个。工厂方法让类的实例化推迟到子类中进行。
3. **抽象工厂模式（Abstract Factory）**：提供一个接口，用于创建一系列相关或依赖对象的家族，而不需要明确指定具体类。
4. **建造者模式（Builder）**：将复杂对象的构建与其表示分离，允许通过指定复杂对象的类型和内容来一步步构造一个复杂对象。
5. **原型模式（Prototype）**：通过复制现有的实例来创建新的实例。

### 2.1.1 工厂方法模式
  

工厂方法模式（Factory Method Pattern）是一种创建型设计模式，其核心思想是定义一个创建对象的接口，但让子类决定要实例化的类是哪一个。工厂方法让类的实例化推迟到子类中进行，从而使得扩展成为可能，而不需要修改现有的代码。

#### 2.1.1.1 工厂方法模式的主要角色：

1. **抽象工厂（Creator）**：提供一个创建产品的接口。
2. **具体工厂（Concrete Creator）**：实现抽象工厂的接口以生成一个具体的产品。
3. **抽象产品（Product）**：定义了产品的接口。
4. **具体产品（Concrete Product）**：实现了抽象产品的接口，是工厂方法模式创建的对象。

#### 2.1.1.2 结构清晰的文本描述：

工厂方法模式通过定义一个抽象的工厂类，将具体的实例化操作推迟到子类中实现。这样做的好处是，当需要添加新的产品时，只需添加一个相应的具体工厂类，而无需修改已有的工厂类和产品类。这提高了系统的扩展性和灵活性。

#### 2.1.1.3 Java代码示例：

工厂方法模式可以通过一个水果工厂的例子来进一步说明。假设我们有一个抽象的“水果”产品，以及几种不同的具体水果，每种水果都由一个具体的工厂来创建。

#### 2.1.1.4 抽象产品（Product）：

```java
public interface Fruit {
    void grow();
}
```

#### 2.1.1.5 具体产品（Concrete Product）：

```java
public class Apple implements Fruit {
    @Override
    public void grow() {
        System.out.println("Apple tree is growing");
    }
}

public class Orange implements Fruit {
    @Override
    public void grow() {
        System.out.println("Orange tree is growing");
    }
}
```

#### 2.1.1.6 抽象工厂（Creator）：

```java
public interface FruitFactory {
    Fruit createFruit();
}
```

#### 2.1.1.7 具体工厂（Concrete Creator）：

```java
public class AppleFactory implements FruitFactory {
    @Override
    public Fruit createFruit() {
        return new Apple();
    }
}

public class OrangeFactory implements FruitFactory {
    @Override
    public Fruit createFruit() {
        return new Orange();
    }
}
```

#### 2.1.1.8 客户端代码：

```java
public class Client {
    public static void main(String[] args) {
        FruitFactory factory;

        // 根据需求选择不同的工厂
        if ("apple".equals(System.getProperty("fruit"))) {
            factory = new AppleFactory();
        } else if ("orange".equals(System.getProperty("fruit"))) {
            factory = new OrangeFactory();
        } else {
            throw new IllegalArgumentException("Invalid fruit type");
        }

        Fruit fruit = factory.createFruit();
        fruit.grow();
    }
}
```

在这个例子中，我们定义了一个`Fruit`接口，它有一个`grow`方法，用以模拟水果生长的行为。`Apple`和`Orange`类实现了`Fruit`接口，代表了两种具体的水果。

`FruitFactory`是一个抽象工厂接口，它定义了一个方法`createFruit`，用于创建`Fruit`对象。`AppleFactory`和`OrangeFactory`是具体工厂，它们分别实现了`createFruit`方法，以创建`Apple`和`Orange`对象。

客户端代码通过传递的参数决定使用哪种工厂来创建水果对象。在实际应用中，这个参数可以来自用户输入、配置文件或环境变量等。

工厂方法模式的关键在于，它将对象的创建逻辑封装在工厂类中，而不是在客户端代码中直接创建对象。这样做的好处是，当需要添加新的产品时，只需要添加相应的具体工厂类，而不需要修改客户端代码或抽象工厂接口，从而提高了系统的可扩展性和可维护性。

### 2.1.2 抽象工厂模式

抽象工厂模式（Abstract Factory Pattern）是一种创建型设计模式，它提供了一种方式，可以创建一系列相关或相互依赖的对象，而不需要指定它们的具体类。这种模式通常用于当需要生成多个系列的产品族时，但每次仅需要生成单个系列中的一个产品。

#### 2.1.2.1 抽象工厂模式的主要角色：

1. **抽象工厂（Abstract Factory）**：定义一个接口用于创建一组相关的产品。
2. **具体工厂（Concrete Factory）**：实现抽象工厂接口，生成一组具体的产品。
3. **抽象产品（Abstract Product）**：定义了产品的接口。
4. **具体产品（Concrete Product）**：实现了抽象产品的接口，是抽象工厂能够创建的对象。

#### 2.1.2.2 结构清晰的文本描述：

抽象工厂模式的核心是将产品族中的对象创建过程封装在相应的工厂类中。客户端不需要知道具体的产品是如何创建的，只需要知道它们属于同一个产品族。这样，当需要切换到另一个产品族时，只需要更改工厂类即可，而不需要修改客户端代码。

#### 2.1.2.3 Java代码示例：

##### 2.1.2.3.1 抽象产品（Abstract Product）：

```java
public interface Fruit {
    void grow();
}

public interface Color {
    void fill();
}
```

##### 2.1.2.3.2 具体产品（Concrete Product）：

```java
public class Apple implements Fruit {
    @Override
    public void grow() {
        System.out.println("Apple tree is growing");
    }
}

public class Orange implements Fruit {
    @Override
    public void grow() {
        System.out.println("Orange tree is growing");
    }
}

public class Red implements Color {
    @Override
    public void fill() {
        System.out.println("Filling with red color");
    }
}

public class Green implements Color {
    @Override
    public void fill() {
        System.out.println("Filling with green color");
    }
}
```

##### 2.1.2.3.3 抽象工厂（Abstract Factory）：

```java
public interface FruitFactory {
    Fruit createFruit();
    Color createColor();
}
```

##### 2.1.2.3.4 具体工厂（Concrete Factory）：

```java
public class AppleFactory implements FruitFactory {
    @Override
    public Fruit createFruit() {
        return new Apple();
    }

    @Override
    public Color createColor() {
        return new Red();
    }
}

public class OrangeFactory implements FruitFactory {
    @Override
    public Fruit createFruit() {
        return new Orange();
    }

    @Override
    public Color createColor() {
        return new Green();
    }
}
```

##### 2.1.2.3.5 客户端代码：

```java
public class Client {
    public static void main(String[] args) {
        FruitFactory factory;

        // 根据需求选择不同的工厂
        if ("apple".equals(System.getProperty("fruit"))) {
            factory = new AppleFactory();
        } else if ("orange".equals(System.getProperty("fruit"))) {
            factory = new OrangeFactory();
        } else {
            throw new IllegalArgumentException("Invalid fruit type");
        }

        Fruit fruit = factory.createFruit();
        Color color = factory.createColor();

        fruit.grow();
        color.fill();
    }
}
```

在这个例子中，我们定义了两个产品族：`Fruit`和`Color`。每个产品族都有自己的抽象产品（`Fruit`和`Color`）和具体产品（`Apple`, `Orange`, `Red`, `Green`）。

`FruitFactory`是一个抽象工厂，它定义了两个方法：`createFruit()`和`createColor()`，分别用于创建水果和颜色。`AppleFactory`和`OrangeFactory`是具体工厂，它们实现了`FruitFactory`接口，并提供了创建相应产品族中的对象的方法。

客户端代码通过传递的参数决定使用哪种工厂来创建对象。在实际应用中，这个参数可以来自用户输入、配置文件或环境变量等。

抽象工厂模式非常适合于当你需要生产一系列产品，而这些产品之间存在相关性或相互依赖性时。通过使用抽象工厂模式，你可以避免硬编码具体的产品类，从而提高系统的灵活性和可扩展性。

### 2.1.3 建造者模式

建造者模式（Builder Pattern）是一种创建型设计模式，用于创建一个复杂对象。它允许通过指定复杂对象的类型和内容来逐步构造一个复杂对象，并允许它分步骤进行。该模式隐藏了对象创建的细节，同时提供了一种创建对象的灵活方式。

建造者模式主要包含以下几个角色：

1. **产品（Product）**：需要创建的复杂对象。
2. **建造者（Builder）**：创建产品的过程和步骤。
3. **指挥者（Director）**：管理建造过程，它知道如何使用建造者来构造产品。
4. **具体建造者（Concrete Builder）**：实现建造者接口，创建具体产品。

当建造者（Builder）和指挥者（Director）都是内部类时，这种设计通常用于当建造过程和指挥逻辑都与外部类紧密相关，且不需要在外部类之外独立存在的情况。内部类提供了一种将相关操作封装在同一个类作用域内的方法，这有助于隐藏实现细节，并且使得外部类的使用更简洁。

#### 2.1.3.1 Java代码示例：

##### 2.1.3.1.1 外部类，包含产品、建造者和指挥者内部类：

```java
public class ComputerFactory {

    // 产品类
    public static class Computer {
        private String cpu;
        private String ram;
        private String hardDisk;

        // 构造方法、getter和setter省略
        public Computer(String cpu, String ram, String hardDisk) {
            this.cpu = cpu;
            this.ram = ram;
            this.hardDisk = hardDisk;
        }

        @Override
        public String toString() {
            return "Computer{" +
                    "cpu='" + cpu + '\'' +
                    ", ram='" + ram + '\'' +
                    ", hardDisk='" + hardDisk + '\'' +
                    '}';
        }
    }

    // 建造者内部类
    public static class ComputerBuilder {
        private String cpu;
        private String ram;
        private String hardDisk;

        public ComputerBuilder setCPU(String cpu) {
            this.cpu = cpu;
            return this;
        }

        public ComputerBuilder setRAM(String ram) {
            this.ram = ram;
            return this;
        }

        public ComputerBuilder setHardDisk(String hardDisk) {
            this.hardDisk = hardDisk;
            return this;
        }

        public Computer build() {
            return new Computer(cpu, ram, hardDisk);
        }
    }

    // 指挥者内部类
    public static class ComputerDirector {
        public Computer construct() {
            ComputerBuilder builder = new ComputerBuilder();
            // 组装计算机
            return builder
                    .setCPU("Intel Core i7")
                    .setRAM("16GB")
                    .setHardDisk("1TB SSD")
                    .build();
        }
    }
}
```

##### 2.1.3.1.2 客户端代码：

```java
public class Client {
    public static void main(String[] args) {
        // 使用ComputerFactory的指挥者构建计算机
        Computer computer = ComputerFactory.ComputerDirector.construct();
        System.out.println(computer);
    }
}
```

在这个例子中，`Computer` 是最终要构建的产品。`ComputerFactory` 包含了两个内部类：`ComputerBuilder`（建造者）和 `ComputerDirector`（指挥者）。建造者负责逐步构建产品，而指挥者负责指导建造过程。

客户端代码通过 `ComputerFactory.ComputerDirector.construct()` 来构建 `Computer` 对象。由于建造者和指挥者都是内部类，它们可以直接访问 `ComputerFactory` 的成员，包括私有成员，这使得建造过程更加直接和高效。

使用内部类实现建造者和指挥者模式，可以使得代码更加紧凑，同时保持了封装性。这种设计适用于建造逻辑和指挥逻辑仅在特定上下文中使用，不需要在外部类之外独立存在的情况。

### 2.1.4 单例模式

 
# 3 参考文献


1. [https://www.itbaima.cn/document/6386mh7anqt4tzyv](https://www.itbaima.cn/document/6386mh7anqt4tzyv)