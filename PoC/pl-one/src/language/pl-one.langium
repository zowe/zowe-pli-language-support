grammar PlOne

import "./terminals";
entry Model:
    (progname+=Progname loop+=Loop endProgram=EndProgram)* |
    (persons+=Person | greetings+=Greeting)*;

Progname:
    name=ID ':' 'PROCEDURE' 'OPTIONS' '(MAIN)' ';' 
    ('/*'name=ID'*/')* 
    'FLAG' '=' num=INT';';

Loop: 
    'LOOP' ':' 'DO' 'WHILE' '(' 'FLAG' '=' num=INT ')' ';' 
        'PUT'  'SKIP' 'DATA''('name=ID')' ';' 
    'END'  'LOOP;';

EndProgram:
    'END' name=ID';';

/*just simple program*/
Person:
    'person' name=ID;

Greeting:
    'Hello' person=[Person:ID] '!';