import Tree from "./Tree.js";

const testArray = [
  1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 85, 67, 43, 30, 58, 77, 39,
];
const tree = new Tree(testArray);
console.log(tree.isBalanced());
tree.print();
console.log(tree.levelOrder((node) => console.log(node.data)));
console.log(tree.preOrder((node) => console.log(node.data)));
console.log(tree.postOrder((node) => console.log(node.data)));
console.log(tree.inOrder((node) => console.log(node.data)));
tree.insert(108);
tree.insert(150);
tree.insert(122);
tree.insert(114);
tree.insert(189);
console.log(tree.isBalanced());
tree.rebalance();
console.log(tree.isBalanced());
tree.print();
console.log(tree.levelOrder((node) => console.log(node.data)));
console.log(tree.preOrder((node) => console.log(node.data)));
console.log(tree.postOrder((node) => console.log(node.data)));
console.log(tree.inOrder((node) => console.log(node.data)));
