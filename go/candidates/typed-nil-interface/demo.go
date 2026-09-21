package main

import "fmt"

type MyError struct{}

func (e *MyError) Error() string { return "boom" }

func main() {
	var p *MyError = nil
	var err error = p
	fmt.Println(err == nil) // false: interface holds a (type, value) pair

	var plain error = nil
	fmt.Println(plain == nil) // true: no dynamic type at all
}
