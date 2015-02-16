#requirement: num stims must be evenly divisible by 24 
library(rjson)

colors = c('red', 'green', 'blue', 'yellow')

# make classic stroop items

num_trials = 48
num_stim_types = 2
items = array(0, dim=c(num_trials, num_stim_types))

for (i in 1:4) {
  # fill words
  num_segment = num_trials/4;
  items[(i*num_segment - (num_segment - 1)):(i*num_segment),1] = rep(colors[i], num_segment)
  
  # fill congruent inks
  num_subsegment = num_segment/2
  items[(i*num_segment - (num_segment - 1)):(((i-1) * num_segment) + num_subsegment),2] = rep(colors[i], num_subsegment)
  
  # fill incongruent inks
  num_subsubsegment = num_subsegment/3
  other_colors = colors[-i]
  items[(i*num_segment - (num_subsegment - 1)):(i*num_segment),2] = cbind(rep(other_colors[1],2), rep(other_colors[2],2), rep(other_colors[3],2))
}

sink("items.js")
cat("var classic_items =")
cat(toJSON(as.data.frame(t(items))))
cat(";\n\n")


#write.table(items, file = 'classic_items.csv', row.names = F, col.names = F)

# make wm stroop items

wm_num_trials = 72
wm_num_stim_types = 3
wm_items = array(0, dim=c(wm_num_trials, wm_num_stim_types))

for (i in 1:4) {
  # fill word1
  num_segment = wm_num_trials/4;
  wm_items[(i*num_segment - (num_segment - 1)):(i*num_segment),1] = rep(colors[i], num_segment)
  
  # fill congruent patch
  num_subsegment = num_segment/2
  wm_items[(i*num_segment - (num_segment - 1)):(((i-1) * num_segment) + num_subsegment),2] = rep(colors[i], num_subsegment)
  
  # fill incongruent patch
  num_subsubsegment = num_subsegment/3
  other_colors = colors[-i]
  wm_items[(i*num_segment - (num_subsegment - 1)):(i*num_segment),2] = c(rep(other_colors[1],num_subsubsegment), 
                                                                        rep(other_colors[2],num_subsubsegment), 
                                                                        rep(other_colors[3],num_subsubsegment))
  
  # fill word 2
  if (i < 3) {
    wm_items[(i*num_segment - (num_segment - 1)):(i*num_segment),3] = c(rep(other_colors[1], num_subsubsegment), 
                                                                       rep(other_colors[2], num_subsubsegment), 
                                                                       rep(colors[i], num_subsegment),
                                                                       rep(other_colors[3], num_subsubsegment))
  } else {
    wm_items[(i*num_segment - (num_segment - 1)):(i*num_segment),3] = c(rep(other_colors[1], num_subsubsegment), 
                                                                        rep(colors[i], num_subsegment),
                                                                        rep(other_colors[2], num_subsubsegment), 
                                                                        rep(other_colors[3], num_subsubsegment))
    }
  }
cat("var wm_items =")
cat(toJSON(as.data.frame(t(wm_items))))
cat(";")
sink()

#write.table(wm_items, file = 'wm_items.csv', row.names = F, col.names = F)

