import { Box } from "@greysole/spooder-component-library";
import React, { useState } from "react";

interface ResponseSearchAndMatchCheatSheetProps {
  isOpen: boolean;
}

export default function ResponseSearchAndMatchCheatSheet({
  isOpen,
}: ResponseSearchAndMatchCheatSheetProps) {
  if (!isOpen) return null;
  return (
    <Box flexFlow="column">
      <p>
        Search and Match is a way to make conditions within normal messages to
        trigger a response instead of the traditional bang (!) command. Every
        word is separated by a space and can be used as a variable in the
        response. Simply putting "hello world" as the command will search
        messages for a literal match of each word in sequence. Matching is done
        in sequence, so the word "world" will not be matched unless "hello" was
        matched first. You can make the trigger sequence smarter with the use of
        special characters defined below.
      </p>
      Variables:
      <ul>
        <li>
          *: Matches any word. Use this to take a word from the message to use
          in the response script.
        </li>
        <li>
          *word: Using asterisk in front of a word will search forward in the
          message for that word and continue matching from that word. Example:
          If you write "hello *ze warudo", then a message saying "I say hello to
          ze warudo" will trigger the response. Because search finds "hello"
          first and then continues searching until "ze". Then if warudo is the
          next word after "ze", the response will trigger.
        </li>
        <li>
          &gt;word: Matches a word that starts with the text after &gt;.
          Example: With "hello &gt;w", you match any word that starts with the
          letter "w". So a message saying "hello warudo" or "hello waluigi"
          would trigger the response.
        </li>
        <li>
          &lt;word: Matches a word that ends with the text after &lt;. Example:
          With "hello &lt;ing", you match any word that ends with the letters
          "ing". So a message saying "hello coding" or "hello goodlooking" would
          trigger the response.
        </li>
        <li>
          |: This pipe character is an OR word. You can define multiple words
          that can match to take the slot. Example: Write "me too|to|two" as the
          command. The response will trigger if the message contains "me to" or
          "me too" or "me two". In the response script, you can return null if
          the 2nd word is "too" and return "Wrong use of 'too' detected!" if
          either of the two ways of spelling "too". The &gt; and &lt; codes also
          work for OR words.
        </li>
      </ul>
      <p>
        The response script will contain all the words matched from the message
        in the extra[] array. So you may write "const firstWord = extra[0]" to
        store the first matched word in a variable.
      </p>
    </Box>
  );
}
