import Node from "./Node.js";

export default class Tree {
  #mergeSort(array) {
    // Base case: arrays with 0 or 1 element are already sorted
    if (array.length <= 1) {
      return array;
    }

    // Split the array into two halves
    const middleIndex = Math.floor(array.length / 2);
    const leftSide = this.#mergeSort(array.slice(0, middleIndex));
    const rightSide = this.#mergeSort(array.slice(middleIndex));

    // Merge the two sorted halves
    const merged = [];
    let i = 0; // Pointer for left array
    let j = 0; // Pointer for right array

    // Compare elements and merge
    while (i < leftSide.length && j < rightSide.length) {
      if (leftSide[i] < rightSide[j]) {
        // Check to prevent duplicates
        if (merged[merged.length - 1] !== leftSide[i]) {
          merged.push(leftSide[i]);
        }
        i += 1;
      } else {
        // Check to prevent duplicates
        if (merged[merged.length - 1] !== rightSide[i]) {
          merged.push(rightSide[j]);
        }
        j += 1;
      }
    }

    // Add any remaining elements
    return merged.concat(leftSide.slice(i)).concat(rightSide.slice(j));
  }

  #buildTree(array, start, end) {
    if (start > end) {
      return null;
    }

    const mid = start + Math.floor((end - start) / 2);
    const root = new Node(array[mid]);
    root.left = this.#buildTree(array, start, mid - 1);
    root.right = this.#buildTree(array, mid + 1, end);

    return root;
  }

  constructor(array) {
    const sortedArray = this.#mergeSort(array);
    this.#root = this.#buildTree(sortedArray, 0, sortedArray.length - 1);
  }

  #root;

  #prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.#prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.#prettyPrint(
        node.left,
        `${prefix}${isLeft ? "    " : "│   "}`,
        true
      );
    }
  }

  print() {
    this.#prettyPrint(this.#root);
  }

  #traverseInsert(node, value) {
    if (value === node.data) {
      return;
    } else if (value < node.data) {
      if (node.left === null) {
        node.left = new Node(value);
      } else {
        this.#traverseInsert(node.left, value);
      }
    } else if (value > node.data) {
      if (node.right === null) {
        node.right = new Node(value);
      } else {
        this.#traverseInsert(node.right, value);
      }
    }
  }

  insert(value) {
    this.#traverseInsert(this.#root, value);
  }

  #findSuccessor(node, parentNode, root) {
    if (node.left === null) {
      if (parentNode === root) {
        parentNode.right = node.right === null ? null : node.right;
      } else {
        parentNode.left = node.right === null ? null : node.right;
      }
      return node;
    } else {
      return this.#findSuccessor(node.left, node, root);
    }
  }

  #traverseDelete(node, value, parent, isLeft) {
    if (node === null) {
      console.log("Value is not in the tree.");
      return;
    }

    if (value === node.data) {
      if (node === this.#root) {
        if (node.left === null && node.right === null) {
          this.#root = null;
        } else if (node.left !== null && node.right === null) {
          this.#root = node.left;
        } else if (node.left === null && node.right !== null) {
          this.#root = node.right;
        } else {
          const successor = this.#findSuccessor(node.right, node, node);
          successor.left = node.left;
          successor.right = node.right;
          this.#root = successor;
        }
      } else {
        if (node.left === null && node.right === null) {
          isLeft ? (parent.left = null) : (parent.right = null);
        } else if (node.left !== null && node.right === null) {
          parent.left = node.left;
        } else if (node.left === null && node.right !== null) {
          parent.right = node.right;
        } else {
          const successor = this.#findSuccessor(node.right, node, node);
          successor.left = node.left;
          successor.right = node.right;
          isLeft ? (parent.left = successor) : (parent.right = successor);
        }
      }
    } else if (value < node.data) {
      this.#traverseDelete(node.left, value, node, true);
    } else if (value > node.data) {
      this.#traverseDelete(node.right, value, node, false);
    }
  }

  deleteItem(value) {
    this.#traverseDelete(this.#root, value);
  }

  #traverseFind(node, value) {
    if (node === null) {
      return null;
    }

    if (value === node.data) {
      return node;
    } else if (value < node.data) {
      return this.#traverseFind(node.left, value);
    } else if (value > node.data) {
      return this.#traverseFind(node.right, value);
    }
  }

  find(value) {
    return this.#traverseFind(this.#root, value);
  }

  #traverseLevelOrderRec(callback, queue) {
    const queueCopy = [...queue];
    if (queueCopy.length === 0) {
      return;
    }
    const node = queueCopy.pop();
    callback(node);
    if (node.left !== null) {
      queueCopy.unshift(node.left);
    }

    if (node.right !== null) {
      queueCopy.unshift(node.right);
    }

    this.#traverseLevelOrderRec(callback, queueCopy);
  }

  levelOrderRec(callback) {
    if (typeof callback !== "function") {
      throw Error("Not a function.");
    }

    const queue = [this.#root];
    this.#traverseLevelOrderRec(callback, queue);
  }

  levelOrder(callback) {
    if (typeof callback !== "function") {
      throw Error("Not a function.");
    }

    const queue = [this.#root];
    while (queue.length !== 0) {
      const node = queue.pop();
      callback(node);
      if (node.left !== null) {
        queue.unshift(node.left);
      }

      if (node.right !== null) {
        queue.unshift(node.right);
      }
    }
  }

  #traverseInOrder(node, callback) {
    if (node === null) {
      return;
    }

    this.#traverseInOrder(node.left, callback);
    callback(node);
    this.#traverseInOrder(node.right, callback);
  }

  inOrder(callback) {
    if (typeof callback !== "function") {
      throw Error("Not a function.");
    }

    this.#traverseInOrder(this.#root, callback);
  }

  #traversePreOrder(node, callback) {
    if (node === null) {
      return;
    }

    callback(node);
    this.#traversePreOrder(node.left, callback);
    this.#traversePreOrder(node.right, callback);
  }

  preOrder(callback) {
    if (typeof callback !== "function") {
      throw Error("Not a function.");
    }

    this.#traversePreOrder(this.#root, callback);
  }

  #traversePostOrder(node, callback) {
    if (node === null) {
      return;
    }

    this.#traversePostOrder(node.left, callback);
    this.#traversePostOrder(node.right, callback);
    callback(node);
  }

  postOrder(callback) {
    if (typeof callback !== "function") {
      throw Error("Not a function.");
    }

    this.#traversePostOrder(this.#root, callback);
  }

  #traverseHeight(node, height) {
    if (node === null) {
      return height - 1;
    }

    return Math.max(
      this.#traverseHeight(node.left, height + 1),
      this.#traverseHeight(node.right, height + 1)
    );
  }

  height(node) {
    if (node === null) {
      return null;
    }

    return this.#traverseHeight(node, 0);
  }

  #traverseDepth(node, targetNode, depth) {
    if (node === targetNode) {
      return depth;
    } else if (targetNode.data < node.data) {
      return this.#traverseDepth(node.left, targetNode, depth + 1);
    } else if (targetNode.data > node.data) {
      return this.#traverseDepth(node.right, targetNode, depth + 1);
    }
  }

  depth(node) {
    if (node === null) {
      return null;
    }

    return this.#traverseDepth(this.#root, node, 0);
  }

  #traverseIsBalanced(node, height) {
    if (node === null) {
      return height - 1;
    }

    const leftHeight = this.#traverseIsBalanced(node.left, height + 1);
    if (!leftHeight) {
      return false;
    }

    const rightHeight = this.#traverseIsBalanced(node.right, height + 1);
    if (!rightHeight) {
      return false;
    }

    if (
      Math.max(leftHeight, rightHeight) - Math.min(leftHeight, rightHeight) >
      1
    ) {
      return false;
    } else {
      return Math.max(leftHeight, rightHeight);
    }
  }

  isBalanced() {
    return this.#traverseIsBalanced(this.#root, 0) ? true : false;
  }

  #traverseRebalance(node, array) {
    if (node === null) {
      return [];
    }

    let arr = [...array];
    return arr
      .concat(this.#traverseRebalance(node.left, arr))
      .concat(node.data)
      .concat(this.#traverseRebalance(node.right, arr));
  }

  rebalance() {
    if (this.isBalanced()) {
      return;
    }

    const array = this.#traverseRebalance(this.#root, []);
    this.#root = this.#buildTree(array, 0, array.length - 1);
  }
}
