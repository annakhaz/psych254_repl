
library(jsonlite)
library(tidyr)
library(dplyr)

full_file <- read.csv("HITResults_final.csv")

col.names = c("task", "trialsLeft", "practice", "trialNum", "word1", "patch",
              "colorRT", "colorResponse", "isicolorRT", "congruent", "colorAccurate", "word2", 
              "sameResponse", "sameRT", "isisameRT", "same", "sameAccurate", "word", "ink") 
df <- read.table(text="", col.names=col.names)

# Note: make sure you remove the trailing commas
for (i in 1:nrow(full_file)) {
  json_data <- fromJSON(toString(full_file$Answer.1[i]), simplifyDataFrame=T)
  json_data <- json_data %>% mutate(subid = i)
  df <- bind_rows(df, json_data)
}

write.csv(df, "rp_final_data.csv")


