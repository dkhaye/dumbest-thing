use std::cell::RefCell;
fn main() {
    let data = RefCell::new(vec![1, 2, 3]);
    let reader = data.borrow();
    println!("reader sees {:?}", *reader);
    data.borrow_mut().push(4);
}
