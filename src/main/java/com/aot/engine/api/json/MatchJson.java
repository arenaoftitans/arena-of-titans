package com.aot.engine.api.json;

import com.aot.engine.Match;
import com.aot.engine.cards.movements.DiagonalMovementsCard;
import com.aot.engine.cards.movements.KnightMovementsCard;
import com.aot.engine.cards.movements.LineAndDiagonalMovementsCard;
import com.aot.engine.cards.movements.LineMovementsCard;
import com.aot.engine.cards.movements.MovementsCard;
import com.aot.engine.trumps.ModifyNumberOfMovesInATurnTrump;
import com.aot.engine.trumps.RemovingColorTrump;
import com.aot.engine.trumps.Trump;
import com.aot.engine.trumps.TrumpBlockingTrump;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import java.lang.reflect.Type;

public class MatchJson {

    private static final String JSON_JAVA_TYPE_KEY = "java_type";

    public static String to(Match match) {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Trump.class, new SerializeTrumps())
                .registerTypeAdapter(MovementsCard.class, new SerializeMovementCards())
                .create();
        return gson.toJson(match);
    }

    private static class SerializeTrumps implements JsonSerializer<Trump> {

        @Override
        public JsonElement serialize(Trump t, Type type, JsonSerializationContext jsc) {
            return t.toJson();
        }

    }

    private static class SerializeMovementCards implements JsonSerializer<MovementsCard> {

        @Override
        public JsonElement serialize(MovementsCard obj, Type type, JsonSerializationContext jsc) {
            // obj must be serialized by a new Gson to avoid infinite recurtion.
            Gson gson = new Gson();
            JsonObject jsonCard = gson.toJsonTree(obj, type).getAsJsonObject();
            jsonCard.addProperty(JSON_JAVA_TYPE_KEY, obj.getClass().toString());

            return jsonCard;
        }
    }

    public static Match from(String json) {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Trump.class, new DeserializeAbstract<Trump>())
                .registerTypeAdapter(MovementsCard.class, new DeserializeAbstract<MovementsCard>())
                .create();
        return gson.fromJson(json, Match.class);
    }

     private static class DeserializeAbstract<T> implements JsonDeserializer<T> {

        @Override
        public T deserialize(JsonElement je, Type type, JsonDeserializationContext jdc) throws JsonParseException {
            JsonObject jsonObj = je.getAsJsonObject();
            String javaType = jsonObj.get(JSON_JAVA_TYPE_KEY).getAsString();
            jsonObj.remove(JSON_JAVA_TYPE_KEY);

            if (javaType.equals(ModifyNumberOfMovesInATurnTrump.class.toString())) {
                return jdc.deserialize(jsonObj, ModifyNumberOfMovesInATurnTrump.class);
            } else if (javaType.equals(RemovingColorTrump.class.toString())) {
                return jdc.deserialize(jsonObj, RemovingColorTrump.class);
            } else if (javaType.equals(TrumpBlockingTrump.class.toString())) {
                return jdc.deserialize(jsonObj, TrumpBlockingTrump.class);
            } else if (javaType.equals(DiagonalMovementsCard.class.toString())) {
                return jdc.deserialize(jsonObj, DiagonalMovementsCard.class);
            } else if (javaType.equals(KnightMovementsCard.class.toString())) {
                return jdc.deserialize(jsonObj, KnightMovementsCard.class);
            } else if (javaType.equals(LineAndDiagonalMovementsCard.class.toString())) {
                return jdc.deserialize(jsonObj, LineAndDiagonalMovementsCard.class);
            } else if (javaType.equals(LineMovementsCard.class.toString())) {
                return jdc.deserialize(jsonObj, LineMovementsCard.class);
            } else {
                return null;
            }
        }

    }
}
