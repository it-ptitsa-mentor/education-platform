const rat1 = makeRational(3, 9)
getNumer(rat1) // 1
getDenom(rat1) // 3

const rat2 = makeRational(10, 3)

const rat3 = add(rat1, rat2)
ratToString(rat3) // '11/3'

const rat4 = sub(rat1, rat2)
ratToString(rat4) // '-3/1'