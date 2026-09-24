Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "IR_Black"

Hide
Type "export PS1='$ '"
Enter
Type "clear"
Enter
Sleep 300ms
Type "cat > /tmp/demo.rs << 'RUST'"
Enter
Sleep 200ms
Type "use std::cell::RefCell;"
Enter
Type "fn main() {"
Enter
Type "    let data = RefCell::new(vec![1, 2, 3]);"
Enter
Type "    let reader = data.borrow();"
Enter
Type '    println!("reader sees {:?}", *reader);'
Enter
Type "    data.borrow_mut().push(4);"
Enter
Type "}"
Enter
Type "RUST"
Enter
Sleep 200ms
Type "rustc /tmp/demo.rs -o /tmp/demo-rs"
Enter
Sleep 5s
Show

Type "/tmp/demo-rs"
Enter
Sleep 3s
