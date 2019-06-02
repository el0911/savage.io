class Solution:
    def isValid(self, s):
        lookUpTable = {
            '(':')',
            "[":"]",
            "{":"}"
        }
        
        stack  = []
        
        for count,char in enumerate(s):
            if char in lookUpTable.keys():
                stack.append(char)
            elif char in lookUpTable.values():
                if len(stack)>0:
                    if char == lookUpTable[stack.pop()]:
                        if count==len(s)-1 and len(stack) == 0 :
                            return True
                        else:
                            pass
                    else:
                        return False
                
            else:
                return False

         
        return False
    def openLock(self):
        startingpoint = [0, 0, 0, 0]
        sequence = [0, 1, 2, 4, 5, 6, 7, 8, 9]

        grid = {}
        deadends = ["0201", "0101", "0102", "1212", "2002"]
        target = "0202"

        from collections import deque
        bases = [1, 10, 100, 1000]
        deads = set(int(x) for x in deadends)
        start, goal = int('0000'), int(target)
        if start in deads:
            return -1
        if start == goal:
            return 0
        q = deque([(start, 0)])
        visited = set([start])
        print(visited)
        while q:
            node, step = q.popleft()
            for i in range(0, 4):
                r = (node // bases[i]) % 10
                for j in [-1, 1]:
                    nxt = node + ((r + j + 10) % 10 - r) * bases[i]
                    if nxt == goal: return step + 1
                    if nxt in deads or nxt in visited: continue
                    q.append((nxt, step + 1))
                    visited.add(nxt)
        return -1


sol = Solution()
print(sol.isValid("{{)}"))
