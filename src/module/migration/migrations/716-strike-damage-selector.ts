import { ItemSourcePF2e } from "@item/data";
import { MigrationBase } from "../base";

export class Migration716StrikeDamageSelector extends MigrationBase {
    static override version = 0.716;

    private itemsToSkip = new Set(["spell-effect-inspire-courage"]);

    override async updateItem(source: ItemSourcePF2e): Promise<void> {
        if (this.itemsToSkip.has(source.data.slug ?? "")) return;

        const { rules } = source.data;
        for (const rule of rules) {
            if (["damage", "mundane-damage"].includes(rule.selector ?? "")) {
                rule.selector = "strike-damage";
            }
        }
    }
}
