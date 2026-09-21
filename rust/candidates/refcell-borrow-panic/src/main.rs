use std::cell::RefCell;

fn main() {
    let count = RefCell::new(5);

    let writer = count.borrow_mut();
    println!("writer sees {}", *writer);

    let reader = count.borrow();
    println!("reader sees {}", *reader);
}
