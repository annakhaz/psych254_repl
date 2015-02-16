wm_raw <- matrix(c(c(1,1,1,1,1),c(1,1,1,1,1),c(1,1,1,1,1),c(1,1,1,1,1),c(1,1,1,1,1),c(1,1,1,1,1),c(1,1,1,1,1),c(1,1,3,1,2),c(1,1,3,1,2),c(1,1,3,1,2),
 c(1,1,2,1,2),c(1,1,4,1,2),c(1,1,4,1,2),c(1,1,4,1,2),c(1,3,1,2,1),c(1,3,1,2,1),c(1,3,1,2,1),c(1,2,1,2,1),c(1,2,1,2,1),c(1,4,1,2,1),
 c(1,3,2,2,2),c(1,3,4,2,2),c(1,3,3,2,2),c(1,4,4,2,2),c(1,4,3,2,2),c(1,4,2,2,2),c(1,2,2,2,2),c(1,2,3,2,2),c(1,2,4,2,2),c(2,2,2,1,1),
 c(2,2,2,1,1),c(2,2,2,1,1),c(2,2,2,1,1),c(2,2,2,1,1),c(2,2,2,1,1),c(2,2,2,1,1),c(2,2,2,1,1),c(2,2,2,1,1),c(2,2,3,1,2),c(2,2,3,1,2),
 c(2,2,1,1,2),c(2,2,1,1,2),c(2,2,1,1,2),c(2,2,4,1,2),c(2,2,4,1,2),c(2,2,4,1,2),c(2,1,2,2,1),c(2,1,2,2,1),c(2,1,2,2,1),c(2,3,2,2,1),
 c(2,3,2,2,1),c(2,3,2,2,1),c(2,4,2,2,1),c(2,4,2,2,1),c(2,4,2,2,1),c(2,1,1,2,2),c(2,1,4,2,2),c(2,4,1,2,2),c(2,4,3,2,2),c(2,4,4,2,2),
 c(2,3,1,2,2),c(2,3,3,2,2),c(2,3,4,2,2),c(3,3,3,1,1),c(3,3,3,1,1),c(3,3,3,1,1),c(3,3,3,1,1),c(3,3,3,1,1),c(3,3,3,1,1),c(3,3,3,1,1),
 c(3,3,1,1,2),c(3,3,1,1,2),c(3,3,1,1,2),c(3,3,2,1,2),c(3,3,4,1,2),c(3,3,4,1,2),c(3,3,4,1,2),c(3,1,3,2,1),c(3,1,3,2,1),c(3,1,3,2,1),
 c(3,2,3,2,1),c(3,2,3,2,1),c(3,4,3,2,1),c(3,4,3,2,1),c(3,4,3,2,1),c(3,1,1,2,2),c(3,1,4,2,2),c(3,2,1,2,2),c(3,2,4,2,2),c(3,4,1,2,2),
 c(3,4,2,2,2),c(4,4,4,1,1),c(4,4,4,1,1),c(4,4,4,1,1),c(4,4,4,1,1),c(4,4,4,1,1),c(4,4,4,1,1),c(4,4,3,1,2),c(4,4,3,1,2),c(4,4,3,1,2),
 c(4,4,2,1,2),c(4,4,2,1,2),c(4,4,2,1,2),c(4,4,1,1,2),c(4,4,1,1,2),c(4,4,1,1,2),c(4,3,4,2,1),c(4,3,4,2,1),c(4,3,4,2,1),c(4,2,4,2,1),
 c(4,2,4,2,1),c(4,1,4,2,1),c(4,1,4,2,1),c(4,1,3,2,2),c(4,3,1,2,2),c(4,3,3,2,2),c(4,3,2,2,2),c(4,2,1,2,2),c(4,2,3,2,2),c(4,2,2,2,2)), ncol=5, byrow=T)

wm <- data.frame(wm_raw)
wm$X1 <- factor(wm$X1)
wm$X2 <- factor(wm$X2)
wm$X3 <- factor(wm$X3)
wm$X4 <- factor(wm$X4)
wm$X5 <- factor(wm$X5)
summary(wm)
# 30 of each word, 30 of each patch color, 30 of each probe, 60 of ?, 60 of each congruency

# classic will have 48 trials, 12 stim in each
12 of each color word
12 of each color ink
24 of each congruency

first 24 are congruent
6 are r and r
6 are g and g
6 are b and b
6 are y and y

second 24 are not

6 are r and ~r (2 g, 2 b, 2 y)
6 are g and ~g (2 r, 2 b, 2 y)
6 are b and ~b (2 r, 2 b, 2 y)
6 are y and ~y (2 r, 2 g, 2 b)

# [word, ink, congruency]
classic = array(0, dim=c(48,3))

for (i in 1:6) {
  #congruent word
  classic[i,1] = 1
  classic[i+6,1] = 2
  classic[i+12,1] = 3
  classic[i+18,1] = 4
  #congruent ink
  classic[i,2] = 1
  classic[i+6,2] = 2
  classic[i+12,2] = 3
  classic[i+18,2] = 4
  #congruent
  classic[i,3] = 1
  classic[i+6,3] = 1
  classic[i+12,3] = 1
  classic[i+18,3] = 1
  #incongruent word
  classic[i+24,1] = 1
  classic[i+30,1] = 2
  classic[i+36,1] = 3
  classic[i+42,1] = 4
}
for (j in 1:2) {
  #incongruent inks
  classic[j+24,2] = 2
  classic[j+26,2] = 3
  classic[j+28,2] = 4
  
  classic[j+30,2] = 1
  classic[j+32,2] = 3
  classic[j+34,2] = 4
  
  classic[j+36,2] = 1
  classic[j+38,2] = 2
  classic[j+40,2] = 4
  
  classic[j+42,2] = 1
  classic[j+44,2] = 2
  classic[j+46,2] = 3
}
