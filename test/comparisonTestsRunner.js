"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs = require("fs");
const minimatch = require("minimatch");
require("mocha");
const path = require("path");
const classInstanceFactory_1 = require("../lib/factories/classInstanceFactory");
const commandsAndMatchersFactory_1 = require("../lib/factories/commandsAndMatchersFactory");
const parser_1 = require("../lib/parser");
/**
 * Test runner for comparing converted .gls files and expected output.
 */
class ComparisonTestsRunner {
    /**
     * Initializes a new instance of the ComparisonTestsRunner class.
     *
     * @param section   Friendly directory path to read tests under.
     * @param commandsToRun   Command groups to run, if not all.
     */
    constructor(section, commandsToRun = new Set(["*"])) {
        const rootDirectory = path.join(__dirname, "../lib/commands/en-us");
        this.section = section;
        this.commandsToRun = commandsToRun;
        this.rootPath = path.resolve(section);
        this.commandTests = readTestsUnderPath(this.rootPath, this.commandsToRun);
        this.parser = new parser_1.Parser({
            commandNames: fs.readdirSync(rootDirectory),
            commandsAndMatchersFactory: new commandsAndMatchersFactory_1.CommandsAndMatchersFactory({
                classInstanceFactory: new classInstanceFactory_1.ClassInstanceFactory({
                    importFile: (filePath) => Promise.resolve(require((filePath))),
                    rootDirectory,
                }),
            }),
        });
    }
    /**
     * Runs tests under the directory path.
     */
    run() {
        describe(this.section, () => {
            this.commandTests.forEach((tests, command) => {
                it(command, () => __awaiter(this, void 0, void 0, function* () { return yield this.runCommandTest(command); }));
            });
        });
    }
    /**
     * Runs a test for a single command in a language.
     *
     * @param command   A GLS command to be tested, such as "ArrayInitialize".
     * @param test   A test to be run for the command, such as "no values".
     * @param language   The language the test is running as.
     */
    runCommandTest(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = this.readCommandFile(command, "source.txt");
            const expected = this.readCommandFile(command, "expected.gls");
            const actual = [];
            for (const sourceLine of source) {
                const actualLine = yield this.parser.parseLine(sourceLine);
                actual.push(...(actualLine === undefined
                    ? [""]
                    : actualLine));
            }
            chai_1.expect(actual).to.be.deep.equal(expected);
        });
    }
    /**
     * Reads the code contents of a test file.
     *
     * @param command   The command this file is under.
     * @param name   The name of the file.
     * @returns   Lines of code in the file.
     */
    readCommandFile(command, name) {
        const filePath = path.resolve(this.rootPath, command, name);
        const lines = fs.readFileSync(filePath).toString().replace(/\r/g, "").split("\n");
        return lines.slice(lines.indexOf("-") + 1, lines.lastIndexOf("-"));
    }
}
exports.ComparisonTestsRunner = ComparisonTestsRunner;
/**
 * Retrieves, for each command in a directory, tests under that command.
 *
 * @param rootPath   An absolute path to a command's tests folder.
 * @param commandsToRun   Command groups to run, if not all.
 * @returns Tests for each command in a directory.
 */
const readTestsUnderPath = (rootPath, commandsToRun) => {
    const tests = new Map();
    let childrenNames = fs.readdirSync(rootPath);
    if (commandsToRun !== undefined) {
        const commandMatchers = Array.from(commandsToRun.keys());
        childrenNames = childrenNames
            .filter((childName) => commandMatchers.some((commandMatcher) => minimatch(childName, commandMatcher, {
            nocase: true,
        })));
    }
    for (const childName of childrenNames) {
        tests.set(childName, fs.readdirSync(path.resolve(rootPath, childName))
            .filter((testFileName) => testFileName.indexOf(".gls") !== -1)
            .map((testFileName) => testFileName.substring(0, testFileName.indexOf(".gls"))));
    }
    return tests;
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvY29tcGFyaXNvblRlc3RzUnVubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQkFBOEI7QUFDOUIseUJBQXlCO0FBQ3pCLHVDQUF1QztBQUN2QyxpQkFBZTtBQUNmLDZCQUE2QjtBQUU3QixnRkFBNkU7QUFDN0UsNEZBQXlGO0FBQ3pGLDBDQUF1QztBQUV2Qzs7R0FFRztBQUNIO0lBMEJJOzs7OztPQUtHO0lBQ0gsWUFBbUIsT0FBZSxFQUFFLGdCQUE2QixJQUFJLEdBQUcsQ0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQztZQUNyQixZQUFZLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7WUFDM0MsMEJBQTBCLEVBQUUsSUFBSSx1REFBMEIsQ0FBQztnQkFDdkQsb0JBQW9CLEVBQUUsSUFBSSwyQ0FBb0IsQ0FBQztvQkFDM0MsVUFBVSxFQUFFLENBQUMsUUFBZ0IsS0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RFLGFBQWE7aUJBQ2hCLENBQUM7YUFDTCxDQUFDO1NBQ0wsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0ksR0FBRztRQUNOLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBZSxFQUFFLE9BQWU7Z0JBQ3ZELEVBQUUsQ0FBQyxPQUFPLEVBQUUscURBQVksTUFBTSxDQUFOLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQSxHQUFBLENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNVLGNBQWMsQ0FBQyxPQUFlOztZQUN2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMzRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztZQUMvRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFFbEIsR0FBRyxDQUFDLENBQUMsTUFBTSxVQUFVLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLElBQUksQ0FDUCxHQUFHLENBQUMsVUFBVSxLQUFLLFNBQVM7c0JBQ3RCLENBQUMsRUFBRSxDQUFDO3NCQUNKLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQztZQUVELGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssZUFBZSxDQUFDLE9BQWUsRUFBRSxJQUFZO1FBQ2pELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsRixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztDQUVKO0FBakdELHNEQWlHQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxRQUFnQixFQUFFLGFBQTBCO0lBQ3BFLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO0lBQzFDLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFN0MsRUFBRSxDQUFDLENBQUMsYUFBYSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6RCxhQUFhLEdBQUcsYUFBYTthQUN4QixNQUFNLENBQ0gsQ0FBQyxTQUFTLEtBQUssZUFBZSxDQUFDLElBQUksQ0FDL0IsQ0FBQyxjQUFjLEtBQUssU0FBUyxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUU7WUFDckQsTUFBTSxFQUFFLElBQUk7U0FDZixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBQyxNQUFNLFNBQVMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxHQUFHLENBQ0wsU0FBUyxFQUNULEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDNUMsTUFBTSxDQUFDLENBQUMsWUFBWSxLQUFLLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDN0QsR0FBRyxDQUFDLENBQUMsWUFBWSxLQUFLLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDakIsQ0FBQyxDQUFDIiwiZmlsZSI6InRlc3QvY29tcGFyaXNvblRlc3RzUnVubmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhwZWN0IH0gZnJvbSBcImNoYWlcIjtcclxuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XHJcbmltcG9ydCAqIGFzIG1pbmltYXRjaCBmcm9tIFwibWluaW1hdGNoXCI7XHJcbmltcG9ydCBcIm1vY2hhXCI7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbmltcG9ydCB7IENsYXNzSW5zdGFuY2VGYWN0b3J5IH0gZnJvbSBcIi4uL2xpYi9mYWN0b3JpZXMvY2xhc3NJbnN0YW5jZUZhY3RvcnlcIjtcclxuaW1wb3J0IHsgQ29tbWFuZHNBbmRNYXRjaGVyc0ZhY3RvcnkgfSBmcm9tIFwiLi4vbGliL2ZhY3Rvcmllcy9jb21tYW5kc0FuZE1hdGNoZXJzRmFjdG9yeVwiO1xyXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi4vbGliL3BhcnNlclwiO1xyXG5cclxuLyoqXHJcbiAqIFRlc3QgcnVubmVyIGZvciBjb21wYXJpbmcgY29udmVydGVkIC5nbHMgZmlsZXMgYW5kIGV4cGVjdGVkIG91dHB1dC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb21wYXJpc29uVGVzdHNSdW5uZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBNaW5pbWF0Y2hlcnMgZm9yIGNvbW1hbmQgZ3JvdXBzIHRvIHJ1bi5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21tYW5kc1RvUnVuOiBTZXQ8c3RyaW5nPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbW1hbmQgdGVzdHMgdG8gYmUgcnVuIHdpdGhpbiB0aGUgc2VjdGlvbi5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21tYW5kVGVzdHM6IE1hcDxzdHJpbmcsIHN0cmluZ1tdPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhcnNlcyByYXcgc3RyaW5nIGxpbmVzIGludG8gR0xTLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhcnNlcjogUGFyc2VyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzayByb290IHBhdGggZm9yIHRoZSBzZWN0aW9uLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvb3RQYXRoOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGcmllbmRseSBkaXJlY3RvcnkgcGF0aCB0byByZWFkIHRlc3RzIHVuZGVyLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNlY3Rpb246IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBDb21wYXJpc29uVGVzdHNSdW5uZXIgY2xhc3MuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHNlY3Rpb24gICBGcmllbmRseSBkaXJlY3RvcnkgcGF0aCB0byByZWFkIHRlc3RzIHVuZGVyLlxyXG4gICAgICogQHBhcmFtIGNvbW1hbmRzVG9SdW4gICBDb21tYW5kIGdyb3VwcyB0byBydW4sIGlmIG5vdCBhbGwuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZWN0aW9uOiBzdHJpbmcsIGNvbW1hbmRzVG9SdW46IFNldDxzdHJpbmc+ID0gbmV3IFNldDxzdHJpbmc+KFtcIipcIl0pKSB7XHJcbiAgICAgICAgY29uc3Qgcm9vdERpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vbGliL2NvbW1hbmRzL2VuLXVzXCIpO1xyXG4gICAgICAgIHRoaXMuc2VjdGlvbiA9IHNlY3Rpb247XHJcbiAgICAgICAgdGhpcy5jb21tYW5kc1RvUnVuID0gY29tbWFuZHNUb1J1bjtcclxuICAgICAgICB0aGlzLnJvb3RQYXRoID0gcGF0aC5yZXNvbHZlKHNlY3Rpb24pO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFRlc3RzID0gcmVhZFRlc3RzVW5kZXJQYXRoKHRoaXMucm9vdFBhdGgsIHRoaXMuY29tbWFuZHNUb1J1bik7XHJcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgUGFyc2VyKHtcclxuICAgICAgICAgICAgY29tbWFuZE5hbWVzOiBmcy5yZWFkZGlyU3luYyhyb290RGlyZWN0b3J5KSxcclxuICAgICAgICAgICAgY29tbWFuZHNBbmRNYXRjaGVyc0ZhY3Rvcnk6IG5ldyBDb21tYW5kc0FuZE1hdGNoZXJzRmFjdG9yeSh7XHJcbiAgICAgICAgICAgICAgICBjbGFzc0luc3RhbmNlRmFjdG9yeTogbmV3IENsYXNzSW5zdGFuY2VGYWN0b3J5KHtcclxuICAgICAgICAgICAgICAgICAgICBpbXBvcnRGaWxlOiAoZmlsZVBhdGg6IHN0cmluZykgPT4gUHJvbWlzZS5yZXNvbHZlKHJlcXVpcmUoKGZpbGVQYXRoKSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3REaXJlY3RvcnksXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSdW5zIHRlc3RzIHVuZGVyIHRoZSBkaXJlY3RvcnkgcGF0aC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJ1bigpOiB2b2lkIHtcclxuICAgICAgICBkZXNjcmliZSh0aGlzLnNlY3Rpb24sICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb21tYW5kVGVzdHMuZm9yRWFjaCgodGVzdHM6IHN0cmluZ1tdLCBjb21tYW5kOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgICAgIGl0KGNvbW1hbmQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMucnVuQ29tbWFuZFRlc3QoY29tbWFuZCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJ1bnMgYSB0ZXN0IGZvciBhIHNpbmdsZSBjb21tYW5kIGluIGEgbGFuZ3VhZ2UuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbW1hbmQgICBBIEdMUyBjb21tYW5kIHRvIGJlIHRlc3RlZCwgc3VjaCBhcyBcIkFycmF5SW5pdGlhbGl6ZVwiLlxyXG4gICAgICogQHBhcmFtIHRlc3QgICBBIHRlc3QgdG8gYmUgcnVuIGZvciB0aGUgY29tbWFuZCwgc3VjaCBhcyBcIm5vIHZhbHVlc1wiLlxyXG4gICAgICogQHBhcmFtIGxhbmd1YWdlICAgVGhlIGxhbmd1YWdlIHRoZSB0ZXN0IGlzIHJ1bm5pbmcgYXMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBydW5Db21tYW5kVGVzdChjb21tYW5kOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLnJlYWRDb21tYW5kRmlsZShjb21tYW5kLCBcInNvdXJjZS50eHRcIik7XHJcbiAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSB0aGlzLnJlYWRDb21tYW5kRmlsZShjb21tYW5kLCBcImV4cGVjdGVkLmdsc1wiKTtcclxuICAgICAgICBjb25zdCBhY3R1YWwgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBzb3VyY2VMaW5lIG9mIHNvdXJjZSkge1xyXG4gICAgICAgICAgICBjb25zdCBhY3R1YWxMaW5lID0gYXdhaXQgdGhpcy5wYXJzZXIucGFyc2VMaW5lKHNvdXJjZUxpbmUpO1xyXG4gICAgICAgICAgICBhY3R1YWwucHVzaChcclxuICAgICAgICAgICAgICAgIC4uLihhY3R1YWxMaW5lID09PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICA/IFtcIlwiXVxyXG4gICAgICAgICAgICAgICAgICAgIDogYWN0dWFsTGluZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwZWN0KGFjdHVhbCkudG8uYmUuZGVlcC5lcXVhbChleHBlY3RlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWFkcyB0aGUgY29kZSBjb250ZW50cyBvZiBhIHRlc3QgZmlsZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29tbWFuZCAgIFRoZSBjb21tYW5kIHRoaXMgZmlsZSBpcyB1bmRlci5cclxuICAgICAqIEBwYXJhbSBuYW1lICAgVGhlIG5hbWUgb2YgdGhlIGZpbGUuXHJcbiAgICAgKiBAcmV0dXJucyAgIExpbmVzIG9mIGNvZGUgaW4gdGhlIGZpbGUuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZENvbW1hbmRGaWxlKGNvbW1hbmQ6IHN0cmluZywgbmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHRoaXMucm9vdFBhdGgsIGNvbW1hbmQsIG5hbWUpO1xyXG4gICAgICAgIGNvbnN0IGxpbmVzID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpLnJlcGxhY2UoL1xcci9nLCBcIlwiKS5zcGxpdChcIlxcblwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxpbmVzLnNsaWNlKGxpbmVzLmluZGV4T2YoXCItXCIpICsgMSwgbGluZXMubGFzdEluZGV4T2YoXCItXCIpKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZXMsIGZvciBlYWNoIGNvbW1hbmQgaW4gYSBkaXJlY3RvcnksIHRlc3RzIHVuZGVyIHRoYXQgY29tbWFuZC5cclxuICpcclxuICogQHBhcmFtIHJvb3RQYXRoICAgQW4gYWJzb2x1dGUgcGF0aCB0byBhIGNvbW1hbmQncyB0ZXN0cyBmb2xkZXIuXHJcbiAqIEBwYXJhbSBjb21tYW5kc1RvUnVuICAgQ29tbWFuZCBncm91cHMgdG8gcnVuLCBpZiBub3QgYWxsLlxyXG4gKiBAcmV0dXJucyBUZXN0cyBmb3IgZWFjaCBjb21tYW5kIGluIGEgZGlyZWN0b3J5LlxyXG4gKi9cclxuY29uc3QgcmVhZFRlc3RzVW5kZXJQYXRoID0gKHJvb3RQYXRoOiBzdHJpbmcsIGNvbW1hbmRzVG9SdW46IFNldDxzdHJpbmc+KTogTWFwPHN0cmluZywgc3RyaW5nW10+ID0+IHtcclxuICAgIGNvbnN0IHRlc3RzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xyXG4gICAgbGV0IGNoaWxkcmVuTmFtZXMgPSBmcy5yZWFkZGlyU3luYyhyb290UGF0aCk7XHJcblxyXG4gICAgaWYgKGNvbW1hbmRzVG9SdW4gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmRNYXRjaGVycyA9IEFycmF5LmZyb20oY29tbWFuZHNUb1J1bi5rZXlzKCkpO1xyXG4gICAgICAgIGNoaWxkcmVuTmFtZXMgPSBjaGlsZHJlbk5hbWVzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgICAoY2hpbGROYW1lKSA9PiBjb21tYW5kTWF0Y2hlcnMuc29tZShcclxuICAgICAgICAgICAgICAgICAgICAoY29tbWFuZE1hdGNoZXIpID0+IG1pbmltYXRjaChjaGlsZE5hbWUsIGNvbW1hbmRNYXRjaGVyLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vY2FzZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB9KSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgY2hpbGROYW1lIG9mIGNoaWxkcmVuTmFtZXMpIHtcclxuICAgICAgICB0ZXN0cy5zZXQoXHJcbiAgICAgICAgICAgIGNoaWxkTmFtZSxcclxuICAgICAgICAgICAgZnMucmVhZGRpclN5bmMocGF0aC5yZXNvbHZlKHJvb3RQYXRoLCBjaGlsZE5hbWUpKVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigodGVzdEZpbGVOYW1lKSA9PiB0ZXN0RmlsZU5hbWUuaW5kZXhPZihcIi5nbHNcIikgIT09IC0xKVxyXG4gICAgICAgICAgICAgICAgLm1hcCgodGVzdEZpbGVOYW1lKSA9PiB0ZXN0RmlsZU5hbWUuc3Vic3RyaW5nKDAsIHRlc3RGaWxlTmFtZS5pbmRleE9mKFwiLmdsc1wiKSkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGVzdHM7XHJcbn07XHJcbiJdfQ==
