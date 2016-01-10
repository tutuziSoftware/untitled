describe("Card", ()=>{
    describe("クリーチャー", ()=>{
        var hanki = new nabiki.Card({
            "name":()=>"半機",
            "creature_type":()=>"機械",
            "flavor_text":()=>"彼の口は機械による利便性を説いた。しかし彼の無くした腕は痛みを訴えた。　ーーー機械神",
            "caption":()=>"アップキープ時、あなたは1点のライフを失う。アップキープ時、あなたはカードを1枚引く",
            "costs":[
                ["hanki_cost_id", (field, you_id)=>{
                    //fieldからマナを2つ取り除けるか確認する
                    //fieldからマナを2つ取り除く
                    //fieldに半機を出す
                }]
            ],
            "power":()=>2,
            "toughness":()=>2,
            "upkeep_step":(field, you_id, enemy_id)=>{
                //アップキープ時に、あなたは1点のライフを失う
                field[you_id].hp(-1);

                //アップキープ時に、あなたはカードを1枚引く
                field[you_id].hands.draw();
            }
        });

        it("半機", ()=>{
            expect(hanki.name()).toBe("半機");
            expect(hanki.creature_type()).toBe("機械");
            expect(hanki.flavor_text()).toBe("彼の口は機械による利便性を説いた。しかし彼の無くした腕は痛みを訴えた。　ーーー機械神");
            expect(hanki.caption()).toBe("アップキープ時、あなたは1点のライフを失う。アップキープ時、あなたはカードを1枚引く");
            expect(hanki.power()).toBe(2);
            expect(hanki.toughness()).toBe(2);
        });

        it("コスト関数の参照、追加、削除はMapで行う(オブジェクト指向的には悪い手だが、わざわざget,put,deleteを用意すべきなのかは今後考えるべきもの)", ()=>{
            expect(hanki.costs().size).toBe(1);
            expect(typeof hanki.costs().get("hanki_cost_id")).toBe("function");
        });
    });


    describe("手札",()=>{
        var hands = new nabiki.Hands;

        it("手札の追加",()=>{
            expect(hands.length).toBe(0);
            hands.push(new nabiki.Card({name:()=>"test"}));
            expect(hands.length).toBe(1);
            expect(hands[0].name()).toBe("test");
        });

        it("手札の削除",()=>{
            expect(hands.length).toBe(1);
            hands.remove(0);
            expect(hands.length).toBe(0);
            expect(hands[0]).toBeUndefined();
        });
    });


    describe("カードデッキ",()=>{
        var deck = new nabiki.Deck([
            {
                "length":4,
                "card":{
                    "name":()=>"半機"
                }
            },
            {
                "length":4,
                "card":{
                    "name":()=>"妄想の天使"
                }
            }
        ]);

        it("ドロー",(done)=>{
            expect(deck.length).toBe(8);
            deck.draw(0).then((card)=>{
                expect(card.name()).toBe("半機");
                expect(deck.length).toBe(7);

                deck.draw(1).then((card)=>{
                    expect(card.name()).toBe("妄想の天使");
                    expect(deck.length).toBe(6);

                    deck.draw(2).catch((message)=>{
                        expect(message).toBe(nabiki.OUT_OF_BOUNDS);
                        expect(deck.length).toBe(6);
                        done();
                    });
                });
            });
        });
    });


    describe("自分の場",()=>{
        var field = new nabiki.HalfField(new nabiki.Hands);

        it("ライフ", ()=>{
            expect(field.life()).toBe(20);
            field.life(-1);
            expect(field.life()).toBe(19);
        });

        it("マナ",()=>{
            expect(field.mana()).toBe(0);
            field.mana(1);
            expect(field.mana()).toBe(1);
            field.mana(-1);
            expect(field.mana()).toBe(0);
        });

        it("手札",()=>{
            expect(field.hands).not.toBeUndefined();
            expect(field.hands.length).toBe(0);
        });

        it("戦場");
    });

    describe("各ステップの実装",()=>{
        //var rule = new nabiki.Rule;

        it("最初のドロー");
        it("アンタップステップ");
        it("アップキープステップ");
        it("メインステップ");
        it("アタックステップ");
        it("メインステップ");
        it("ターンエンドステップ");
    });
});
