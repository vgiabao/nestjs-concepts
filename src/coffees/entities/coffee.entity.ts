import { WithUuid } from "src/common/mixins/with-uuid.mixin/with-uuid.mixin";

export class Coffee {
    constructor(public name: string) { }

    534
}


const CoffeeWithUuidCls = WithUuid(Coffee)


const coffee = new CoffeeWithUuidCls("Latte")

console.log(coffee.id)
coffee.regenerateId()